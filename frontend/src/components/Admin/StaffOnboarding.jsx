import { useState } from "react";
import { Plus } from "lucide-react";
import { MotionCardSurface } from "../Dashboard/MotionCardSurface.jsx";
import { formatDate } from "../../utils/helpers";

/**
 * Staff Onboarding form with username suggestions
 */
export const StaffOnboarding = ({
    maintenanceUsers,
    onInviteStaff,
    onFetchSuggestions,
    latestInvite,
}) => {
    const [staffForm, setStaffForm] = useState({ username: "", email: "", fullName: "" });
    const [staffLoading, setStaffLoading] = useState(false);
    const [staffError, setStaffError] = useState("");
    const [staffNotice, setStaffNotice] = useState("");
    const [staffSuggestions, setStaffSuggestions] = useState([]);
    const [staffSuggestionLoading, setStaffSuggestionLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStaffLoading(true);
        setStaffError("");
        setStaffNotice("");
        try {
            await onInviteStaff(staffForm);
            setStaffNotice(`Invite queued. The account appears after the invite is accepted.`);
            setStaffForm({ username: "", email: "", fullName: "" });
            setStaffSuggestions([]);
        } catch (err) {
            const message = err?.response?.data?.message || "Failed to create staff invitation.";
            setStaffError(message);
            if (message.toLowerCase().includes("username")) {
                await fetchSuggestions(staffForm.username, staffForm.fullName);
            }
        } finally {
            setStaffLoading(false);
        }
    };

    const fetchSuggestions = async (username, fullName) => {
        if (!username || username.trim().length < 3) {
            setStaffSuggestions([]);
            return;
        }
        setStaffSuggestionLoading(true);
        try {
            const suggestions = await onFetchSuggestions(username, fullName || "");
            setStaffSuggestions(suggestions);
        } catch {
            setStaffSuggestions([]);
        } finally {
            setStaffSuggestionLoading(false);
        }
    };

    return (
        <MotionCardSurface
            as="section"
            cardId="admin-staff-onboarding"
            sectionId="staff"
            className="motion-section dashboard-panel interactive-surface"
            trackSection
        >
            <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Staff Onboarding</h3>
                <span className="pill-badge bg-campus-50 text-campus-600 dark:bg-campus-900/20 dark:text-campus-400">
                    {maintenanceUsers.length} active maintenance users
                </span>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
                    <input
                        required minLength={3} maxLength={50} autoComplete="username" name="username"
                        value={staffForm.username}
                        onChange={(e) => { setStaffForm((p) => ({ ...p, username: e.target.value })); setStaffSuggestions([]); }}
                        onBlur={() => fetchSuggestions(staffForm.username, staffForm.fullName)}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-campus-400 focus:ring-2 focus:ring-campus-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-campus-900/30"
                        placeholder="e.g. jmwangi"
                    />
                    {staffSuggestionLoading && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Checking suggestions…</p>}
                    {staffSuggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {staffSuggestions.map((s) => (
                                <button key={s} type="button" onClick={() => setStaffForm((p) => ({ ...p, username: s }))}
                                    className="interactive-control rounded-full bg-campus-50 px-3 py-1 text-xs font-semibold text-campus-600 transition hover:bg-campus-100 dark:bg-campus-900/20 dark:text-campus-400">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
                    <input required maxLength={120} autoComplete="name" name="fullName"
                        value={staffForm.fullName}
                        onChange={(e) => setStaffForm((p) => ({ ...p, fullName: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-campus-400 focus:ring-2 focus:ring-campus-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-campus-900/30"
                        placeholder="e.g. James Mwangi"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                    <input required type="email" autoComplete="email" name="email"
                        value={staffForm.email}
                        onChange={(e) => setStaffForm((p) => ({ ...p, email: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-campus-400 focus:ring-2 focus:ring-campus-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-campus-900/30"
                        placeholder="e.g. jmwangi@campus.local"
                    />
                </div>
                <div className="md:col-span-3 flex flex-wrap items-center gap-3">
                    <button disabled={staffLoading} className="btn-primary interactive-control">
                        <Plus size={16} />
                        {staffLoading ? "Sending Invite…" : "Send Invite"}
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Staff appear in the user list after they accept the invite link by email.</p>
                </div>
            </form>

            {staffError && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{staffError}</p>}
            {staffNotice && <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">{staffNotice}</p>}
            {latestInvite && (
                <div className="mt-3 rounded-xl border border-campus-100 bg-campus-50/60 px-4 py-3 text-xs text-campus-700 dark:border-campus-900/40 dark:bg-campus-900/20 dark:text-campus-300">
                    Latest invite: @{latestInvite.username} ({latestInvite.email}) expires on {formatDate(latestInvite.expiresAt)}.
                </div>
            )}
        </MotionCardSurface>
    );
};
