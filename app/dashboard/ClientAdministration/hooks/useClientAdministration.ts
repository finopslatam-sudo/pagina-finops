'use client';

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { ClientInfo, ClientUser, Subscription, UserForm } from "../types";

interface SubscriptionResponse {
  data: Subscription;
}

interface ClientUsersResponse {
  data: ClientUser[];
}

interface AwsStatusResponse {
  accounts_used: number;
  accounts_limit: number;
}

interface ClientSecurityResponse {
  data: {
    mfa_policy: "disabled" | "optional" | "required" | "required_for_admins";
    mfa_updated_at?: string | null;
  };
}

interface UpgradeResponse {
  data?: {
    status?: string;
    requested_plan?: string;
    message?: string;
  };
}

export function useClientAdministration() {
  const { token } = useAuth();

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return fallback;
  };

  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [awsAccounts, setAwsAccounts] = useState<number>(0);
  const [awsAccountsLimit, setAwsAccountsLimit] = useState<number>(0);
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  // User modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<ClientUser | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetPasswordEnabled, setResetPasswordEnabled] = useState(false);

  const [userForm, setUserForm] = useState<UserForm>({
    name: "",
    email: "",
    role: "viewer",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (token) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadData = async () => {
    try {
      const [clientRes, subRes, usersRes, awsRes, securityRes] = await Promise.all([
        apiFetch<ClientInfo>("/api/client", { token }),
        apiFetch<SubscriptionResponse>("/api/client/subscription", { token }),
        apiFetch<ClientUsersResponse>("/api/client/users", { token }),
        apiFetch<AwsStatusResponse>("/api/client/aws/status", { token }),
        apiFetch<ClientSecurityResponse>("/api/client/security", { token }),
      ]);

      setClient({
        ...clientRes,
        mfa_policy: securityRes.data.mfa_policy,
        mfa_updated_at: securityRes.data.mfa_updated_at || null,
      });
      setSubscription(subRes.data);
      setUsers(usersRes.data || []);
      setAwsAccounts(awsRes.accounts_used || 0);
      setAwsAccountsLimit(awsRes.accounts_limit || 0);
    } catch (err: unknown) {
      console.error("Error al cargar los datos de administración del cliente:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Plan limits ─────────────────────────────────────────────────────────────

  let userLimit = 3;
  if (subscription?.plan_code === "FINOPS_PROFESSIONAL") userLimit = 9;
  if (subscription?.plan_code === "FINOPS_ENTERPRISE") userLimit = 12;
  const userLimitReached = users.length >= userLimit;

  // ── Upgrade ──────────────────────────────────────────────────────────────────

  const upgradePlan = async (planCode: string) => {
    try {
      setUpgrading(true);
      setShowUpgradeModal(false);
      setShowProcessingModal(true);

      const res = await apiFetch<UpgradeResponse>("/api/client/subscription/upgrade", {
        method: "POST",
        token,
        body: { plan_code: planCode },
      });

      if (!res || !res.data || res.data.status !== "pending") {
        console.error("Unexpected API response:", res);
        throw new Error("Upgrade request failed");
      }

      setShowProcessingModal(false);
      setUpgradeSuccess(true);
      await loadData();
    } catch (err: unknown) {
      console.error(err);
      setShowProcessingModal(false);
      const message = getErrorMessage(err, "No se pudo actualizar el plan");

      if (message === "Upgrade request already pending") {
        alert(
          "Ya existe una solicitud de upgrade pendiente. Un administrador debe aprobarla antes de solicitar otra."
        );
      } else if (message === "Downgrade not allowed") {
        alert("No es posible cambiar a un plan inferior.");
      } else {
        alert("No se pudo actualizar el plan");
      }
    } finally {
      setUpgrading(false);
    }
  };

  // ── User CRUD ────────────────────────────────────────────────────────────────

  const openCreateUser = () => {
    if (userLimitReached) {
      alert(`Tu plan permite máximo ${userLimit} usuarios.`);
      return;
    }
    setEditingUser(null);
    setUserForm({ name: "", email: "", role: "viewer", password: "", confirmPassword: "" });
    setResetPasswordEnabled(false);
    setShowUserModal(true);
  };

  const openEditUser = (u: ClientUser) => {
    setEditingUser(u);
    setUserForm({
      name: u.contact_name || "",
      email: u.email,
      role: u.client_role,
      password: "",
      confirmPassword: "",
    });
    setResetPasswordEnabled(false);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
  };

  const createUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim() || !userForm.password.trim()) {
      alert("Todos los campos son obligatorios");
      return;
    }
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
          password: userForm.password,
        },
      });
      setShowUserModal(false);
      setSuccessMessage("Usuario creado con éxito");
      setUserForm({ name: "", email: "", role: "viewer", password: "", confirmPassword: "" });
      await loadData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "No se pudo crear el usuario"));
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;
    try {
      setSavingUser(true);
      await apiFetch(`/api/client/users/${editingUser.id}`, {
        method: "PUT",
        token,
        body: {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
        },
      });

      if (resetPasswordEnabled) {
        await apiFetch(`/api/client/users/${editingUser.id}/reset-password`, {
          method: "POST",
          token,
        });
      }

      setShowUserModal(false);
      setSuccessMessage(
        resetPasswordEnabled
          ? "Usuario actualizado y contraseña temporal enviada al correo."
          : "Cambios guardados con éxito"
      );
      await loadData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "No se pudo actualizar el usuario"));
    } finally {
      setSavingUser(false);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await apiFetch(`/api/client/users/${userId}`, { method: "DELETE", token });
      setSuccessMessage("Usuario eliminado con éxito");
      await loadData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "No se pudo eliminar el usuario"));
    }
  };

  const activateUser = async (userId: number) => {
    try {
      await apiFetch(`/api/client/users/${userId}/activate`, { method: "PATCH", token });
      setSuccessMessage("Usuario reactivado con éxito");
      await loadData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "No se pudo activar el usuario"));
    }
  };

  const updateMfaPolicy = async (
    policy: "disabled" | "optional" | "required" | "required_for_admins"
  ) => {
    try {
      setSavingSecurity(true);
      const res = await apiFetch<ClientSecurityResponse>("/api/client/security", {
        method: "PATCH",
        token,
        body: { mfa_policy: policy },
      });

      setClient((prev) => prev ? {
        ...prev,
        mfa_policy: res.data.mfa_policy,
        mfa_updated_at: res.data.mfa_updated_at || null,
      } : prev);
      setSuccessMessage("Política MFA actualizada con éxito");
    } catch (err: unknown) {
      alert(getErrorMessage(err, "No se pudo actualizar la política MFA"));
    } finally {
      setSavingSecurity(false);
    }
  };

  return {
    // data
    loading,
    client,
    subscription,
    users,
    awsAccounts,
    awsAccountsLimit,
    savingSecurity,
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
    updateMfaPolicy,
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
  };
}
