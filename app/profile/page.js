import Link from "next/link";
import Phone from "../../components/Phone";
import TopBar from "../../components/TopBar";
import BottomNav from "../../components/BottomNav";
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
    <div className={s.menu}>
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
    <Phone>
      <TopBar
        title="Profile"
        back={false}
        right={
          <button className="icon-btn" aria-label="Settings">
            <Settings size={22} />
          </button>
        }
      />
      <div className="screen screen-pad has-nav">
        <div className={s.header}>
          <Avatar pose="idle" round alt="Your profile photo" className={s.pic} />
          <div className="grow">
            <div className={s.name}>Alex Johnson</div>
            <div className={s.email}>alex.johnson@email.com</div>
            <span className={`badge badge-brand ${s.role}`}>
              Customer Service Advisor
            </span>
          </div>
          <button className={s.editBtn}>
            <Edit size={15} /> Edit
          </button>
        </div>

        <div className={s.pro}>
          <Sparkle size={24} />
          <div className={s.pt}>
            <b>Upgrade to Pro</b>
            <span>Unlimited mock interviews & CV reviews</span>
          </div>
          <button className={s.go}>Upgrade</button>
        </div>

        <div className={s.groupLabel}>Account</div>
        <Menu items={ACCOUNT} />

        <div className={s.groupLabel}>Preferences</div>
        <Menu items={PREFS} />

        <div className={s.groupLabel}>Support</div>
        <Menu items={SUPPORT} />

        <div className={s.menu} style={{ marginTop: 22 }}>
          <Link className={`${s.item} ${s.danger}`} href="/">
            <span className={s.mi}>
              <LogOut size={19} />
            </span>
            <span className={s.lbl}>Log out</span>
          </Link>
        </div>
      </div>
      <BottomNav active="profile" />
    </Phone>
  );
}
