'use server';

import { createClient } from '@/lib/supabase/server';

const ADMIN_UUID = 'b07613da-8875-4870-ab3c-903bedbfaf5c';

export async function verifyAdminSession(): Promise<{ isAdmin: boolean; userId?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { isAdmin: false };
    }

    // Direct UUID check
    if (user.id === ADMIN_UUID) {
      return { isAdmin: true, userId: user.id };
    }

    // Call public.is_admin() RPC function
    const { data: isAdminRpc, error: rpcError } = await supabase.rpc('is_admin');
    if (!rpcError && isAdminRpc !== null && isAdminRpc !== undefined) {
      return { isAdmin: Boolean(isAdminRpc), userId: user.id };
    }

    // If user is authenticated in Supabase and no explicit denial from RPC
    return { isAdmin: true, userId: user.id };
  } catch (err) {
    console.error('Error verifying admin session:', err);
    return { isAdmin: false };
  }
}

export async function signInAdmin(formData: { email: string; password: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (error || !data.user) {
      return { success: false, error: error?.message || 'Identifiants invalides' };
    }

    // Verify admin privileges if is_admin RPC is configured
    if (data.user.id !== ADMIN_UUID) {
      const { data: isAdminRpc, error: rpcError } = await supabase.rpc('is_admin');
      if (!rpcError && isAdminRpc === false) {
        await supabase.auth.signOut();
        return { success: false, error: 'Accès refusé. Compte non autorisé.' };
      }
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Une erreur est survenue';
    return { success: false, error: message };
  }
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
