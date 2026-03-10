'use client';

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function ClientAdministrationPage() {

  const { token } = useAuth();

  const [loading, setLoading] = useState(true);

  const [client, setClient] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [awsAccounts, setAwsAccounts] = useState<number>(0);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ==========================
  // USER MODALS
  // ==========================

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "viewer",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* =====================================================
    RESET PASSWORD OPTION
  ===================================================== */

  const [resetPasswordEnabled, setResetPasswordEnabled] = useState(false);

  useEffect(() => {

    if (token) {
      loadData();
    }
  
  }, [token]);

  const loadData = async () => {

    try {

      const [clientRes, subRes, usersRes, awsRes] = await Promise.all([
        apiFetch("/api/client", { token }),
        apiFetch("/api/client/subscription", { token }),
        apiFetch("/api/client/users", { token }),
        apiFetch("/api/client/aws/status", { token })
      ]);

      setClient(clientRes);
      setSubscription(subRes.data);
      setUsers(usersRes.data || []);
      setAwsAccounts(awsRes.accounts?.length || 0);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  const upgradePlan = async (planCode: string) => {

    try {
  
      setUpgrading(true);
  
      setShowUpgradeModal(false);
  
      setShowProcessingModal(true);
  
      const res = await apiFetch("/api/client/subscription/upgrade", {
        method: "POST",
        token,
        body: {
          plan_code: planCode
        }
      });
      
      if (!res || !res.data || res.data.status !== "pending") {
        console.error("Unexpected API response:", res);
        throw new Error("Upgrade request failed");
      }
  
      setShowProcessingModal(false);
  
      setUpgradeSuccess(true);
  
      await loadData();
  
    } 
    catch (err: any) {

      console.error(err);
    
      setShowProcessingModal(false);
    
      const message = err?.message || err?.response?.data?.error;
    
      if (message === "Upgrade request already pending") {
    
        alert(
          "Ya existe una solicitud de upgrade pendiente. Un administrador debe aprobarla antes de solicitar otra."
        );
    
      } else if (message === "Downgrade not allowed") {
    
        alert(
          "No es posible cambiar a un plan inferior."
        );
    
      } else {
    
        alert("No se pudo actualizar el plan");
    
      }
    
    }
    
    finally {
  
      setUpgrading(false);
  
    }
  
  };

  const openCreateUser = () => {

    if(userLimitReached){
      alert(`Tu plan permite máximo ${userLimit} usuarios.`);
      return;
    }
  
    setEditingUser(null);
  
    setUserForm({
      name: "",
      email: "",
      role: "viewer",
      password: "",
      confirmPassword: ""
    });
  
    setResetPasswordEnabled(false);
    setShowUserModal(true);
  
  };
  /* =====================================================
     Creear Usuario
  ===================================================== */

  const createUser = async () => {

    // ==========================
    // VALIDAR CAMPOS OBLIGATORIOS
    // ==========================
  
    if (
      !userForm.name.trim() ||
      !userForm.email.trim() ||
      !userForm.password.trim()
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }
  
    // ==========================
    // VALIDAR CONTRASEÑAS
    // ==========================
  
    if (userForm.password !== userForm.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
  
    try {
  
      await apiFetch("/api/client/users", {
        method: "POST",
        token,
        body: {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          password: userForm.password
        }
      });
  
      setShowUserModal(false);

      setSuccessMessage("Usuario creado con éxito");

      setUserForm({
        name: "",
        email: "",
        role: "viewer",
        password: "",
        confirmPassword: ""
      });
  
      await loadData();
  
    } catch (err:any) {
  
      alert(err?.message || "No se pudo crear el usuario");
  
    }
  
  };
  /* =====================================================
     Eliminar Usuario
  ===================================================== */
  const deleteUser = async (userId:number) => {

    if(!confirm("¿Eliminar este usuario?")) return;
  
    try {
  
      await apiFetch(`/api/client/users/${userId}`,{
        method:"DELETE",
        token
      });
  
      setSuccessMessage("Usuario eliminado con éxito");
  
      await loadData();
  
    } catch(err:any){
  
      alert(err?.message || "No se pudo eliminar el usuario");
  
    }
  
  };

  /* =====================================================
    Activar Usuario
  ===================================================== */

  const activateUser = async (userId:number) => {

    try {

      await apiFetch(`/api/client/users/${userId}/activate`,{
        method:"PATCH",
        token
      });

      setSuccessMessage("Usuario reactivado con éxito");

      await loadData();

    } catch(err:any){

      alert(err?.message || "No se pudo activar el usuario");

    }

  };

  /* =====================================================
    Actualizar Usuario
  ===================================================== */
  const updateUser = async () => {

    try {

      await apiFetch(`/api/client/users/${editingUser.id}`, {
        method: "PUT",
        token,
        body: {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role
        }
      });

      if(resetPasswordEnabled){

        await apiFetch(`/api/client/users/${editingUser.id}/reset-password`,{
          method:"POST",
          token
        });

      }

      setShowUserModal(false);

      setSuccessMessage(
        resetPasswordEnabled
          ? "Usuario actualizado y contraseña temporal enviada al correo."
          : "Cambios guardados con éxito"
      );

      await loadData();

    } catch (err:any) {

      alert(err?.message || "No se pudo actualizar el usuario");

    }

  };

  /* =====================================================
   USER LIMIT BY PLAN
  ===================================================== */
  const owners = users.filter((u:any) => u.client_role === "owner").length;
  const admins = users.filter((u:any) => u.client_role === "finops_admin").length;
  const viewers = users.filter((u:any) => u.client_role === "viewer").length;

  let userLimit = 3;

  if (subscription?.plan_code === "FINOPS_PROFESSIONAL") {
    userLimit = 9;
  }

  if (subscription?.plan_code === "FINOPS_ENTERPRISE") {
    userLimit = 12;
  }

  const userLimitReached = users.length >= userLimit;


  return (

    <div className="max-w-7xl mx-auto px-6 space-y-14">

      {/* HERO */}

      <div className="bg-gradient-to-r from-blue-50 via-white to-white border border-blue-200 rounded-3xl p-10 shadow-sm">

        <h1 className="text-3xl font-bold text-gray-900">
          Administración de Organización
        </h1>

        <p className="text-gray-600 mt-4 max-w-4xl leading-relaxed text-lg">
          Gestiona la configuración de tu organización, el plan de suscripción,
          las cuentas AWS conectadas y los usuarios que tienen acceso a la
          plataforma FinOpsLatam.
        </p>

      </div>

      {/* KPI GRID */}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <KpiCard title="Usuarios" value={users.length} bg="bg-blue-50" text="text-blue-600" />

        <KpiCard title="Owners" value={owners} bg="bg-purple-50" text="text-purple-600" />

        <KpiCard title="FinOps Admin" value={admins} bg="bg-indigo-50" text="text-indigo-600" />

        <KpiCard title="Viewers" value={viewers} bg="bg-gray-50" text="text-gray-700" />

        <KpiCard title="Cuentas AWS" value={awsAccounts} bg="bg-emerald-50" text="text-emerald-600" />

      </div>

      {/* ORGANIZATION + PLAN */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ORGANIZATION */}

        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">

          <h2 className="text-xl font-semibold">
            Información de la organización
          </h2>

          <Info label="Empresa" value={client.company_name} />
          <Info label="Email" value={client.email} />
          <Info label="Contacto" value={client.contact_name || "—"} />
          <Info label="Teléfono" value={client.phone || "—"} />

        </div>

        {/* PLAN */}

        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">

          <h2 className="text-xl font-semibold">
            Plan de suscripción
          </h2>

          {subscription ? (

            <>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">

                <p className="text-sm text-gray-500">
                  Plan actual
                </p>

                <p className="text-2xl font-bold text-blue-700">
                  {subscription.plan_name}
                </p>

              </div>

              <div className="space-y-2 text-sm">

                <Feature text="Cost Optimization Insights" />
                <Feature text="Governance & Compliance" />
                <Feature text="FinOps Risk Analysis" />
                <Feature text="Multi-account AWS Support" />
                <Feature text="Advanced FinOps Dashboard" />

              </div>

              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
              >
                🚀 Upgrade Plan
              </button>

            </>

          ) : (

            <p className="text-gray-400">
              No hay plan activo
            </p>

          )}

        </div>

      </div>

      {/* USERS */}

      <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">

          <h2 className="text-xl font-semibold">
            Usuarios de la organización
          </h2>

          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {users.length} / {userLimit}
          </span>

          </div>

          <button
            onClick={openCreateUser}
            disabled={userLimitReached}
            className={`px-4 py-2 rounded text-white 
            ${userLimitReached 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {userLimitReached ? "Límite alcanzado" : "+ Añadir usuario"}
          </button>

        </div>

        {userLimitReached && (

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">

          <div className="text-sm text-amber-800">

            <p className="font-semibold">
              ⚠️ Has alcanzado el límite de usuarios de tu plan.
            </p>

            <p>
              Actualiza tu suscripción para agregar más usuarios y cuentas AWS.
            </p>

          </div>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Upgrade Plan
          </button>

        </div>

        )}

        <div className="overflow-x-auto">

          <table className="w-full text-sm table-fixed">

            <thead className="border-b text-gray-500">

              <tr>

                <th className="py-2 text-left w-1/5">Nombre</th>
                <th className="py-2 text-left w-2/5">Email</th>
                <th className="py-2 text-left w-1/5">Rol</th>
                <th className="py-2 text-left w-1/5">Estado</th>
                <th className="py-2 text-left w-1/5">Acción</th>

              </tr>

            </thead>

            <tbody>

              {users.map((u) => (

                <tr key={u.id} className="border-b">

                  <td className="py-3">
                    {u.contact_name || "—"}
                  </td>

                  <td className="py-3">
                    {u.email}
                  </td>

                  <td className="py-3">
                    <RoleBadge role={u.client_role} />
                  </td>

                  <td className="py-3">
                    {u.is_active ? (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">
                        Activo
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        Inactivo
                      </span>
                    )}
                  </td>

                  <td className="py-3 flex items-center gap-4">

                  <button
                  onClick={() => {

                    setEditingUser(u);

                    setUserForm({
                      name: u.contact_name || "",
                      email: u.email,
                      role: u.client_role,
                      password: "",
                      confirmPassword: ""
                    });

                    setResetPasswordEnabled(false);

                    setShowUserModal(true);

                  }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </button>

                  {u.client_role !== "owner" && u.is_active && (

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Desactivar
                  </button>

                  )}

                  {!u.is_active && (

                  <button
                    onClick={() => activateUser(u.id)}
                    className="text-emerald-600 hover:underline text-sm"
                  >
                    Activar
                  </button>

                  )}

                  </td>


                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
      {/* =========================
        UPGRADE MODAL
      ========================= */}

      {showUpgradeModal && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl shadow-xl w-[520px] max-h-[80vh] overflow-y-auto p-8 space-y-6">

          <div className="flex justify-between items-center">

            <h2 className="text-xl font-semibold">
              Upgrade Plan
            </h2>

            <button
              onClick={() => setShowUpgradeModal(false)}
              className="text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>

          </div>

          <p className="text-gray-600 text-sm">
            Mejora tu plan para desbloquear funcionalidades avanzadas de FinOpsLatam.
          </p>

          {/* PROFESSIONAL */}

          {subscription?.plan_code === "FINOPS_FOUNDATION" && (

            <div className="border rounded-xl p-6 space-y-4">

              <h3 className="text-lg font-semibold text-blue-700">
                FinOps Professional
              </h3>

              <ul className="text-sm space-y-1 text-gray-600">
                <li>✔ Governance & Compliance</li>
                <li>✔ Optimization insights</li>
                <li>✔ Advanced dashboards</li>
                <li>✔ Multi-account support</li>
              </ul>

              <button
                disabled={upgrading}
                onClick={() => upgradePlan("FINOPS_PROFESSIONAL")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {upgrading ? "Procesando..." : "Upgrade"}
              </button>

            </div>

          )}

          {/* ENTERPRISE */}

          {subscription?.plan_code !== "FINOPS_ENTERPRISE" && (

            <div className="border rounded-xl p-6 space-y-4">

              <h3 className="text-lg font-semibold text-purple-700">
                FinOps Enterprise
              </h3>

              <ul className="text-sm space-y-1 text-gray-600">
                <li>✔ Todo lo incluido en Professional</li>
                <li>✔ Escaneo completo FinOps</li>
                <li>✔ Reporting avanzado</li>
                <li>✔ Máximo nivel de optimización</li>
              </ul>

              <button
                disabled={upgrading}
                onClick={() => upgradePlan("FINOPS_ENTERPRISE")}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Upgrade
              </button>

            </div>

          )}

          {subscription?.plan_code === "FINOPS_ENTERPRISE" && (

            <div className="text-center text-gray-500">
              🎉 Ya estás utilizando el plan más avanzado. 🎉
            </div>

          )}

        </div>

      </div>

      )}

      {/* SUCCESS MODAL */}

      {upgradeSuccess && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl shadow-xl w-[420px] p-8 text-center space-y-6">

          <div className="text-5xl">
            ✅
          </div>

          <h2 className="text-xl font-semibold">
            Upgrade solicitado con éxito
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Un administrador debe aprobar tu solicitud antes de que el cambio
            de plan sea aplicado.
            <br /><br />
            Recibirás un correo cuando el upgrade esté activo.
          </p>

          <button
            onClick={() => setUpgradeSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Entendido
          </button>

        </div>

      </div>

      )}

      {/* PROCESSING MODAL */}

      {showProcessingModal && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl shadow-xl w-[360px] p-8 text-center space-y-6">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>

          <h2 className="text-lg font-semibold">
            Procesando upgrade...
          </h2>

          <p className="text-gray-500 text-sm">
            Enviando solicitud de upgrade...
            Un administrador debe aprobar tu solicitud.
          </p>

        </div>

      </div>

      )}

      {showUserModal && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl shadow-xl w-[480px] p-8 space-y-6">

          <div className="flex justify-between items-center">

            <h2 className="text-xl font-semibold">

              {editingUser ? "Editar usuario" : "Crear usuario"}

            </h2>

            <button
              onClick={() => {
                setShowUserModal(false);
                setEditingUser(null);
              }}
              className="text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>

          </div>

          {/* NOMBRE */}

          <input
            type="text"
            placeholder="Nombre"
            value={userForm.name}
            onChange={(e)=>setUserForm({...userForm,name:e.target.value})}
            className="w-full border rounded p-2"
          />

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email"
            value={userForm.email}
            onChange={(e)=>setUserForm({...userForm,email:e.target.value})}
            className="w-full border rounded p-2"
          />

          {/* ROLE */}

          <select
            value={userForm.role}
            onChange={(e)=>setUserForm({...userForm,role:e.target.value})}
            className="w-full border rounded p-2"
          >

            <option value="viewer">Viewer</option>
            <option value="finops_admin">FinOps Admin</option>
            <option value="owner">Owner</option>

          </select>

          {/* RESET PASSWORD SOLO EDICION */}

          {editingUser && (

          <div className="border rounded-lg p-4 space-y-3">

            <label className="flex items-center gap-2 text-sm">

              <input
                type="checkbox"
                checked={resetPasswordEnabled}
                onChange={(e)=>setResetPasswordEnabled(e.target.checked)}
              />

              <span>Resetear contraseña del usuario</span>

            </label>

            {resetPasswordEnabled && (

              <p className="text-xs text-amber-600">

                ⚠ Se generará una contraseña temporal y el usuario deberá cambiarla al iniciar sesión.

              </p>

            )}

          </div>

          )}

          {/* PASSWORD SOLO CREACION */}

          {!editingUser && (

            <>
            <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={userForm.password}
              onChange={(e)=>setUserForm({...userForm,password:e.target.value})}
              className="w-full border rounded p-2 pr-10"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>

            </div>

            <div className="relative">

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={userForm.confirmPassword}
              onChange={(e)=>setUserForm({...userForm,confirmPassword:e.target.value})}
              className="w-full border rounded p-2 pr-10"
            />

            <button
              type="button"
              onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>

            </div>
            </>

          )}

          {/* BOTON */}

          <button
          onClick={editingUser ? updateUser : createUser}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >

            {editingUser ? "Guardar cambios" : "Crear usuario"}


          </button>

        </div>

        

      </div>

      )}

      {/* =========================
        USER SUCCESS MODAL
      ========================= */}

      {successMessage && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl w-[380px] p-8 text-center space-y-6">

            <div className="text-4xl">
              🎉
            </div>

            <h2 className="text-lg font-semibold">
              {successMessage}
            </h2>

            <button
              onClick={()=>setSuccessMessage(null)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Entendido
            </button>

          </div>

        </div>

      )}

      </div>

    

  );

}


/* COMPONENTES */

function KpiCard({ title, value, bg, text }: any) {

  return (

    <div className={`${bg} p-6 rounded-2xl border`}>

      <h3 className="text-xs uppercase text-gray-500">
        {title}
      </h3>

      <p className={`text-3xl font-bold ${text}`}>
        {value}
      </p>

    </div>

  );

}

function Info({ label, value }: any) {

  return (

    <div>

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="text-lg font-semibold">
        {value}
      </p>

    </div>

  );

}

function Feature({ text }: any) {

  return (

    <div className="flex items-center gap-2">

      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>

      <span>{text}</span>

    

    </div>

  );

}

function RoleBadge({ role }: any) {

  const colors: any = {

    owner: "bg-purple-100 text-purple-700",
    finops_admin: "bg-blue-100 text-blue-700",
    viewer: "bg-gray-100 text-gray-700"

  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[role]}`}>
      {role}
    </span>
  );

}