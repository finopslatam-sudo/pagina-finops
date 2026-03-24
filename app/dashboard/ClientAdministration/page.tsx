'use client';

import { useClientAdministration } from "./hooks/useClientAdministration";
import CompanyInfoCard from "./components/CompanyInfoCard";
import SubscriptionCard from "./components/SubscriptionCard";
import UsersTable from "./components/UsersTable";
import UserFormModal from "./components/UserFormModal";
import AwsAccountsCard from "./components/AwsAccountsCard";

interface KpiCardProps {
  title: string;
  value: number;
  bg: string;
  text: string;
}

function KpiCard({ title, value, bg, text }: KpiCardProps) {
  return (
    <div className={`${bg} p-6 rounded-2xl border`}>
      <h3 className="text-xs uppercase text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold ${text}`}>{value}</p>
    </div>
  );
}

export default function ClientAdministrationPage() {
  const {
    client,
    subscription,
    users,
    awsAccounts,
    awsAccountsLimit,
    userLimit,
    userLimitReached,
    // upgrade
    showUpgradeModal,
    setShowUpgradeModal,
    upgrading,
    upgradeSuccess,
    setUpgradeSuccess,
    showProcessingModal,
    upgradePlan,
    // users table
    openEditUser,
    deleteUser,
    activateUser,
    // user modal
    showUserModal,
    editingUser,
    openCreateUser,
    closeUserModal,
    userForm,
    setUserForm,
    savingUser,
    createUser,
    updateUser,
    resetPasswordEnabled,
    setResetPasswordEnabled,
    // success
    successMessage,
    setSuccessMessage,
  } = useClientAdministration();

  const owners = users.filter((u) => u.client_role === "owner").length;
  const admins = users.filter((u) => u.client_role === "finops_admin").length;
  const viewers = users.filter((u) => u.client_role === "viewer").length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-10 lg:space-y-14">

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-white border border-blue-200 rounded-3xl p-6 lg:p-10 shadow-sm">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Administración de Organización</h1>
        <p className="text-gray-600 mt-4 max-w-4xl leading-relaxed text-base lg:text-lg">
          Gestiona la configuración de tu organización, el plan de suscripción, las cuentas AWS
          conectadas y los usuarios que tienen acceso a la plataforma FinOpsLatam.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        <KpiCard title="Usuarios"    value={users.length}  bg="bg-blue-50"    text="text-blue-600"    />
        <KpiCard title="Owners"      value={owners}        bg="bg-purple-50"  text="text-purple-600"  />
        <KpiCard title="FinOps Admin" value={admins}       bg="bg-indigo-50"  text="text-indigo-600"  />
        <KpiCard title="Viewers"     value={viewers}       bg="bg-gray-50"    text="text-gray-700"    />
        <KpiCard title="Cuentas AWS" value={awsAccounts}   bg="bg-emerald-50" text="text-emerald-600" />
      </div>

      {/* Organization + Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <CompanyInfoCard client={client} />

        <SubscriptionCard
          subscription={subscription}
          upgrading={upgrading}
          upgradeSuccess={upgradeSuccess}
          showUpgradeModal={showUpgradeModal}
          showProcessingModal={showProcessingModal}
          onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          onCloseUpgradeModal={() => setShowUpgradeModal(false)}
          onCloseUpgradeSuccess={() => setUpgradeSuccess(false)}
          onUpgradePlan={upgradePlan}
        />
      </div>

      {/* AWS Accounts */}
      <AwsAccountsCard awsAccounts={awsAccounts} awsAccountsLimit={awsAccountsLimit} />

      {/* Users table */}
      <UsersTable
        users={users}
        userLimit={userLimit}
        userLimitReached={userLimitReached}
        onOpenCreateUser={openCreateUser}
        onOpenEditUser={openEditUser}
        onDeleteUser={deleteUser}
        onActivateUser={activateUser}
        onOpenUpgradeModal={() => setShowUpgradeModal(true)}
      />

      {/* User create/edit modal */}
      {showUserModal && (
        <UserFormModal
          editingUser={editingUser}
          userForm={userForm}
          savingUser={savingUser}
          resetPasswordEnabled={resetPasswordEnabled}
          onClose={closeUserModal}
          onChangeForm={setUserForm}
          onSetResetPasswordEnabled={setResetPasswordEnabled}
          onSubmit={editingUser ? updateUser : createUser}
        />
      )}

      {/* User action success modal */}
      {successMessage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8 text-center space-y-6">
            <div className="text-4xl">🎉</div>
            <h2 className="text-lg font-semibold">{successMessage}</h2>
            <button
              onClick={() => setSuccessMessage(null)}
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
