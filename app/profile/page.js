"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "../../components/PageHeader";
import { AppShell, PageSection } from "../../components/ui";
import Avatar from "../../components/Avatar";
import {
  Edit,
  Sparkle,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
} from "../../components/Icons";
import {
  updateUser,
  resetToDemo,
  resetToFreshOnboarding,
} from "../../lib/db";
import { useAppDb } from "../../lib/db/use-app-db";
import {
  getSessionUser,
  pushLocalToSupabase,
  pullSupabaseToLocal,
  signOut,
} from "../../lib/supabase/sync";
import s from "./profile.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const { user, USER, MASTER_CV } = useAppDb();
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [syncMsg, setSyncMsg] = useState("");

  const displayName = user?.name || USER.name || "Alex";

  useEffect(() => {
    getSessionUser().then((u) => {
      if (u?.email) setAuthEmail(u.email);
    });
  }, []);

  const startEdit = () => {
    setNameDraft(displayName);
    setEditing(true);
  };

  const saveEdit = () => {
    const next = nameDraft.trim();
    if (next) updateUser({ name: next });
    setEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const handleRestartFresh = () => {
    resetToFreshOnboarding();
    router.replace("/");
  };

  const handleSync = async () => {
    setSyncMsg("Syncing…");
    const pull = await pullSupabaseToLocal();
    if (!pull.ok && pull.error !== "Not signed in") {
      setSyncMsg(pull.error || "Pull failed");
      return;
    }
    const push = await pushLocalToSupabase();
    setSyncMsg(push.ok ? "Synced with cloud." : push.error || "Sync failed");
  };

  return (
    <AppShell>
      <PageHeader title="Profile" description="Your account and CV" />

      <div className={s.hero}>
        <Avatar pose="idle" round alt="Your profile photo" className={s.pic} />
        <div className={s.heroText}>
          {editing ? (
            <input
              className="input"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") setEditing(false);
              }}
              autoFocus
              aria-label="Your name"
            />
          ) : (
            <div className={s.name}>{displayName}</div>
          )}
          <div className={s.email}>
            {authEmail || "Local account · not signed in"}
          </div>
        </div>
        {editing ? (
          <button type="button" className={s.editBtn} onClick={saveEdit}>
            Save
          </button>
        ) : (
          <button type="button" className={s.editBtn} onClick={startEdit}>
            <Edit size={15} /> Edit
          </button>
        )}
      </div>

      <PageSection title="CV">
        <div className={s.panel}>
          <Link className={s.row} href="/cv/upload">
            <span className={s.mi}>
              <FileText size={18} />
            </span>
            <span className={s.lbl}>
              {MASTER_CV.exists
                ? `Replace CV · ${MASTER_CV.fileName}`
                : "Upload your CV"}
            </span>
            <ChevronRight size={18} className={s.chev} />
          </Link>
        </div>
      </PageSection>

      <PageSection title="Account">
        <div className={s.panel}>
          {authEmail ? (
            <button type="button" className={s.row} onClick={handleSync}>
              <span className={s.mi}>
                <Sparkle size={18} />
              </span>
              <span className={s.lbl}>Sync with cloud</span>
              <ChevronRight size={18} className={s.chev} />
            </button>
          ) : (
            <Link className={s.row} href="/login">
              <span className={s.mi}>
                <Sparkle size={18} />
              </span>
              <span className={s.lbl}>Sign in</span>
              <ChevronRight size={18} className={s.chev} />
            </Link>
          )}
          <button type="button" className={s.row} onClick={() => resetToDemo()}>
            <span className={s.mi}>
              <Sparkle size={18} />
            </span>
            <span className={s.lbl}>Load demo data</span>
            <ChevronRight size={18} className={s.chev} />
          </button>
          <button type="button" className={s.row} onClick={handleRestartFresh}>
            <span className={s.mi}>
              <Shield size={18} />
            </span>
            <span className={s.lbl}>Clear & restart onboarding</span>
            <ChevronRight size={18} className={s.chev} />
          </button>
        </div>
        {syncMsg ? <p className={s.syncMsg}>{syncMsg}</p> : null}
      </PageSection>

      <button type="button" className={s.logout} onClick={handleLogout}>
        <LogOut size={18} /> Log out
      </button>
    </AppShell>
  );
}
