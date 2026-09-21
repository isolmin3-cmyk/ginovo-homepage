(function () {
  'use strict';

  var client = null;
  var roleCache = null;

  function config() {
    return window.GINOVO_SUPABASE || {};
  }

  function isConfigured() {
    var value = config();
    return /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value.url || '') &&
      /^(sb_publishable_|eyJ)/.test(value.publishableKey || '');
  }

  function getClient() {
    if (!isConfigured()) throw new Error('SUPABASE_NOT_CONFIGURED');
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      throw new Error('SUPABASE_LIBRARY_UNAVAILABLE');
    }
    if (!client) {
      client = window.supabase.createClient(config().url, config().publishableKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      });
    }
    return client;
  }

  async function getSession() {
    var result = await getClient().auth.getSession();
    if (result.error) throw result.error;
    return result.data.session;
  }

  async function getPublisher(force) {
    var session = await getSession();
    if (!session) return null;
    if (roleCache && !force && roleCache.userId === session.user.id) return roleCache;
    var result = await getClient()
      .from('admin_users')
      .select('user_id, role, active, display_name')
      .eq('user_id', session.user.id)
      .maybeSingle();
    if (result.error) throw result.error;
    if (!result.data || result.data.role !== 'publisher' || result.data.active !== true) return null;
    roleCache = {
      userId: session.user.id,
      email: session.user.email,
      displayName: result.data.display_name || session.user.email,
      role: result.data.role
    };
    return roleCache;
  }

  async function signIn(email, password) {
    roleCache = null;
    var result = await getClient().auth.signInWithPassword({ email: email, password: password });
    if (result.error) throw result.error;
    var publisher = await getPublisher(true);
    if (!publisher) {
      await getClient().auth.signOut();
      throw new Error('PUBLISHER_ACCESS_REQUIRED');
    }
    return publisher;
  }

  async function signOut() {
    roleCache = null;
    if (isConfigured() && window.supabase) await getClient().auth.signOut();
  }

  async function sendPasswordReset(email) {
    var redirectTo = new URL('./admin.html?recovery=1', location.href).href;
    var result = await getClient().auth.resetPasswordForEmail(email, { redirectTo: redirectTo });
    if (result.error) throw result.error;
  }

  async function updatePassword(password) {
    var result = await getClient().auth.updateUser({ password: password });
    if (result.error) throw result.error;
  }

  window.GINOVO_ADMIN_AUTH = {
    isConfigured: isConfigured,
    getClient: getClient,
    getSession: getSession,
    getPublisher: getPublisher,
    signIn: signIn,
    signOut: signOut,
    sendPasswordReset: sendPasswordReset,
    updatePassword: updatePassword
  };
})();
