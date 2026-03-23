import "server-only";

import { createClient } from "@supabase/supabase-js";

type SupabaseServerConfig = {
  url: string;
  key: string;
};

function getSupabaseServerConfig(): {
  config: SupabaseServerConfig | null;
  error: string | null;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    return {
      config: null,
      error: "Configure NEXT_PUBLIC_SUPABASE_URL para carregar as celulas.",
    };
  }

  if (!key) {
    return {
      config: null,
      error:
        "Configure NEXT_PUBLIC_SUPABASE_ANON_KEY ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY para usar o Supabase.",
    };
  }

  return {
    config: {
      url,
      key,
    },
    error: null,
  };
}

export function getSupabaseConfigError() {
  return getSupabaseServerConfig().error;
}

export function getSupabaseServerClient() {
  const { config, error } = getSupabaseServerConfig();

  if (error || !config) {
    throw new Error(error ?? "Configuracao do Supabase nao encontrada.");
  }

  return createClient(config.url, config.key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
