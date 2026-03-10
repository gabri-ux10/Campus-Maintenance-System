import { useMemo, useState } from "react";
import { CalendarClock, CalendarPlus2, ImagePlus, Megaphone, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dock } from "@/components/ui/dock-two";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";
import { useImageUpload } from "@/components/hooks/use-image-upload";
import { MotionCardSurface } from "../Dashboard/MotionCardSurface.jsx";
import { scrollToDashboardSection } from "../Dashboard/scrollToDashboardSection";
import { titleCase, formatDate } from "../../utils/helpers";

const TAB_IMMEDIATE = 0;
const TAB_SCHEDULED = 1;

/**
 * Broadcast Center – instant + scheduled broadcasts with calendar
 */
export const BroadcastCenter = ({
    onBroadcast,
    onSchedule,
    onCancelScheduled,
    scheduledEvents = [],
    scheduledEventsLoading = false,
}) => {
    const [broadcastTab, setBroadcastTab] = useState(TAB_IMMEDIATE);

    // Instant broadcast state
    const [broadcastForm, setBroadcastForm] = useState({ title: "", message: "", audience: "ALL" });
    const [broadcastLoading, setBroadcastLoading] = useState(false);
    const [broadcastError, setBroadcastError] = useState("");
    const [broadcastResult, setBroadcastResult] = useState(null);

    // Scheduled state
    const [scheduleForm, setScheduleForm] = useState({ title: "", message: "", audience: "ALL", scheduledFor: "" });
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [scheduleError, setScheduleError] = useState("");
    const [scheduleResult, setScheduleResult] = useState(null);

    const { previewUrl, fileName, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } = useImageUpload({
        onUpload: () => { },
    });

    const handleBroadcast = async (event) => {
        event.preventDefault();
        setBroadcastLoading(true);
        setBroadcastError("");
        setBroadcastResult(null);
        try {
            const result = await onBroadcast(broadcastForm);
            setBroadcastResult(result);
            setBroadcastForm({ title: "", message: "", audience: broadcastForm.audience });
        } catch (err) {
            setBroadcastError(err?.response?.data?.message || "Failed to send broadcast.");
        } finally {
            setBroadcastLoading(false);
        }
    };

    const handleScheduleBroadcast = async (event) => {
        event.preventDefault();
        setScheduleLoading(true);
        setScheduleError("");
        setScheduleResult(null);
        try {
            const result = await onSchedule(scheduleForm);
            setScheduleResult(result);
            setScheduleForm((p) => ({ ...p, title: "", message: "", scheduledFor: "" }));
        } catch (err) {
            setScheduleError(err?.response?.data?.message || "Failed to schedule event.");
        } finally {
            setScheduleLoading(false);
        }
    };

    const scheduledCalendarData = useMemo(() => {
        const byDay = new Map();
        scheduledEvents
            .filter((item) => item.status !== "CANCELLED")
            .forEach((item) => {
                if (!item.scheduledFor) return;
                const date = new Date(item.scheduledFor);
                if (Number.isNaN(date.getTime())) return;
                const key = date.toDateString();
                const existing = byDay.get(key) || { day: date, events: [] };
                existing.events.push({
                    id: item.id,
                    name: item.title,
                    time: new Date(item.scheduledFor).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    datetime: item.scheduledFor,
                    audience: titleCase((item.audience || "ALL").toLowerCase()),
                    status: titleCase((item.status || "pending").toLowerCase()),
                });
                byDay.set(key, existing);
            });
        return Array.from(byDay.values());
    }, [scheduledEvents]);

    const dockItems = useMemo(() => [
        { icon: Megaphone, label: "Instant Broadcast", onClick: () => setBroadcastTab(TAB_IMMEDIATE) },
        { icon: CalendarClock, label: "Schedule Event", onClick: () => setBroadcastTab(TAB_SCHEDULED) },
    ], []);

    return (
        <MotionCardSurface
            as="section"
            cardId="admin-broadcast-center"
            sectionId="broadcast"
            className="motion-section dashboard-panel interactive-surface"
            trackSection
        >
            <div className="mb-4 flex items-center gap-2">
                <Megaphone size={18} className="text-campus-500" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                    Broadcast & Scheduled Events
                </h3>
            </div>

            <Dock className="mb-3 justify-start" items={dockItems} />
            <ExpandableTabs
                className="mb-4"
                defaultIndex={TAB_IMMEDIATE}
                onChange={(index) => setBroadcastTab(index == null ? TAB_IMMEDIATE : index)}
                tabs={[
                    { title: "Instant Broadcast", icon: Send },
                    { title: "Schedule Event", icon: CalendarClock },
                ]}
            />

            {broadcastTab === TAB_IMMEDIATE && (
                <>
                    <form onSubmit={handleBroadcast} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
                                <Input required maxLength={200} value={broadcastForm.title}
                                    onChange={(e) => setBroadcastForm((p) => ({ ...p, title: e.target.value }))} className="mt-1"
                                    placeholder="e.g. Urgent water shutdown update" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Audience</label>
                                <select value={broadcastForm.audience}
                                    onChange={(e) => setBroadcastForm((p) => ({ ...p, audience: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-campus-400 focus:ring-2 focus:ring-campus-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-campus-900/30">
                                    <option value="ALL">All Users</option>
                                    <option value="STUDENTS">Students Only</option>
                                    <option value="STAFF">Staff Only</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Message</label>
                            <textarea required rows={4} maxLength={5000} value={broadcastForm.message}
                                onChange={(e) => setBroadcastForm((p) => ({ ...p, message: e.target.value }))}
                                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-campus-400 focus:ring-2 focus:ring-campus-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-campus-900/30"
                                placeholder="Write the announcement message for selected users…" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button disabled={broadcastLoading} className="interactive-control">
                                <Send size={16} />
                                {broadcastLoading ? "Sending…" : "Send Broadcast"}
                            </Button>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Delivered instantly as in-app notifications.</p>
                        </div>
                    </form>
                    {broadcastError && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{broadcastError}</p>}
                    {broadcastResult && (
                        <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                            Broadcast delivered to {broadcastResult.recipientCount} recipients ({titleCase(broadcastResult.audience.toLowerCase())}).
                        </p>
                    )}
                </>
            )}

            {broadcastTab === TAB_SCHEDULED && (
                <div className="space-y-5">
                    <form onSubmit={handleScheduleBroadcast} className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Event Title</label>
                                    <Input required maxLength={200} value={scheduleForm.title}
                                        onChange={(e) => setScheduleForm((p) => ({ ...p, title: e.target.value }))} className="mt-1"
                                        placeholder="e.g. Planned electrical maintenance - Block B" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Audience</label>
                                    <select value={scheduleForm.audience}
                                        onChange={(e) => setScheduleForm((p) => ({ ...p, audience: e.target.value }))}
                                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-campus-400 focus:ring-2 focus:ring-campus-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-campus-900/30">
                                        <option value="ALL">All Users</option>
                                        <option value="STUDENTS">Students Only</option>
                                        <option value="STAFF">Staff Only</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Date & Time</label>
                                <Input required type="datetime-local" value={scheduleForm.scheduledFor}
                                    onChange={(e) => setScheduleForm((p) => ({ ...p, scheduledFor: e.target.value }))} className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Notification Message</label>
                                <textarea required rows={4} maxLength={5000} value={scheduleForm.message}
                                    onChange={(e) => setScheduleForm((p) => ({ ...p, message: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-campus-400 focus:ring-2 focus:ring-campus-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-campus-900/30"
                                    placeholder="Message users should receive at the scheduled time…" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Button disabled={scheduleLoading} className="interactive-control">
                                    <CalendarPlus2 size={16} />
                                    {scheduleLoading ? "Scheduling…" : "Schedule Event"}
                                </Button>
                                <p className="text-xs text-gray-500 dark:text-gray-400">The system will send this automatically at the selected date/time.</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-slate-400">Optional Event Image</p>
                            <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            {!previewUrl ? (
                                <button type="button" onClick={handleThumbnailClick}
                                    className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white text-gray-500 transition hover:border-campus-400 hover:text-campus-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-campus-500 dark:hover:text-campus-400">
                                    <ImagePlus size={20} />
                                    <span className="text-xs font-medium">Upload event context image</span>
                                    <span className="text-[11px]">JPG/PNG/WebP</span>
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <img src={previewUrl} alt="Event preview" className="h-44 w-full rounded-xl border border-gray-200 object-cover dark:border-slate-700" />
                                    <div className="flex items-center justify-between gap-2 text-xs text-gray-600 dark:text-slate-300">
                                        <span className="truncate">{fileName}</span>
                                        <button type="button" onClick={handleRemove}
                                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>

                    {scheduleError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{scheduleError}</p>}
                    {scheduleResult && (
                        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                            Event scheduled for {formatDate(scheduleResult.scheduledFor)} ({titleCase(scheduleResult.audience.toLowerCase())}).
                        </p>
                    )}

                    <FullScreenCalendar
                        data={scheduledCalendarData}
                        onCreateEvent={() => {
                            scrollToDashboardSection("broadcast");
                        }}
                    />

                    <div className="rounded-2xl border border-gray-200 p-4 dark:border-slate-700">
                        <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Scheduled Queue</h4>
                        {scheduledEventsLoading && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading scheduled events…</p>}
                        {!scheduledEventsLoading && scheduledEvents.length === 0 && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No scheduled events yet.</p>}
                        {!scheduledEventsLoading && scheduledEvents.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {scheduledEvents.map((item) => (
                                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(item.scheduledFor).toLocaleString()} • {titleCase(item.audience.toLowerCase())} • {titleCase(item.status.toLowerCase())}
                                            </p>
                                        </div>
                                        {item.status === "PENDING" ? (
                                            <Button variant="outline" size="sm" onClick={() => onCancelScheduled(item.id)}>Cancel</Button>
                                        ) : (
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Recipients: {item.recipientCount}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </MotionCardSurface>
    );
};
