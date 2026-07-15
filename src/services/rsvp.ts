import { supabase } from "../lib/supabase";
import type { RSVPData } from "../types/rsvp";

export async function submitRSVP(data: RSVPData) {
  const { data: inserted, error } = await supabase
    .from("rsvp")
    .insert(data)
    .select();

  if (error) throw error;

  return inserted;
}