import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import { AppShell, PageSection } from "../../components/ui";
import Avatar from "../../components/Avatar";
import {
  Settings,
  Edit,
  Sparkle,
  FileText,
  Bookmark,
  Bell,
  Volume,
  CreditCard,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
} from "../../components/Icons";
import s from "./profile.module.css";

const ACCOUNT = [
  { Icon: FileText, label: "My CV", href: "/cv" },
  { Icon: Bookmark, label: "Saved Questions", href: "/questions" },
  { Icon: CreditCard, label: "Subscription", href: "/profile" },
];
const PREFS = [
  { Icon: Bell, label: "Notifications", href: "/profile" },
  { Icon: Volume, label: "Voice & Language", href: "/profile" },
  { Icon: Settings, label: "Settings", href: "/profile" },
];
const SUPPORT = [
  { Icon: HelpCircle, label: "Help & Support", href: "/profile" },
  { Icon: Shield, label: "Privacy & Security", href: "/profile" },
];

function Menu({ items }) {
  return (
    <div className={`card ${s.menu}`}>
      {items.map(({ Icon, label, href }) => (
        <Link className={s.item} key={label} href={href}>
          <span className={s.mi}>
            <Icon size={19} />
          </span>
          <span className={s.lbl}>{label}</span>
          <ChevronRight size={19} className={s.chev} />
        </Link>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AppShell>
      <PageHeader
        icon="user"
        title="Profile"
        description="Account, preferences and subscription"
      />

      <div className={`card ${s.header}`}>
        <Avatar pose="idle" round alt="Your profile photo" className={s.pic} />
        <div className="grow">
          <div className={s.name}>Alex Johnson</div>
          <div className={s.email}>alex.johnson@email.com</div>
          <span className={`badge badge-brand ${s.role}`}>
            Customer Service Advisor
          </span>
        </div>
        <button type="button" className={s.editBtn}>
          <Edit size={15} /> Edit
        </button>
      </div>

      <div className={s.pro}>
        <Sparkle size={24} />
        <div className={s.pt}>
          <b>Upgrade to Pro</b>
          <span>Unlimited mock interviews & CV reviews</span>
        </div>
        <button type="button" className={s.go}>
          Upgrade
        </button>
      </div>

      <PageSection title="Account">
        <Menu items={ACCOUNT} />
      </PageSection>

      <PageSection title="Preferences">
        <Menu items={PREFS} />
      </PageSection>

      <PageSection title="Support">
        <Menu items={SUPPORT} />
      </PageSection>

      <button type="button" className={s.logout}>
        <LogOut size={18} /> Log out
      </button>
    </AppShell>
  );
}
