import { useState } from "react";
import { FiBell, FiCheck, FiClock, FiExternalLink, FiTrash2, FiXCircle } from "react-icons/fi";
import { PiCheckCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import RecruiterDashboardSidebar from "../../components/dashboard/RecruiterDashboardSidebar";
import Loader from "../../components/common/Loader";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { FadeIn } from "../../components/motion/Motion";
import {
  deleteAllNotifications,
  deleteNotification,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../service/notification.service";
import {
  allNotificationsRemoved,
  allNotificationsMarkedRead,
  notificationActionFailure,
  notificationActionStart,
  notificationMarkedRead,
  notificationRemoved,
} from "../../redux/slices/notificationSlice";
import showToast from "../../utils/toast";

const Notifications = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const {
    notifications,
    isLoading,
    error,
    actionId,
  } = useSelector((state) => state.notifications);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const handleMarkRead = async (notificationId) => {
    dispatch(notificationActionStart(notificationId));
    try {
      await markNotificationAsRead(notificationId);
      dispatch(notificationMarkedRead(notificationId));
    } catch (requestError) {
      dispatch(
        notificationActionFailure(
          requestError.response?.data?.message ||
            "Unable to update notification.",
        ),
      );
      showToast.error(
        requestError.response?.data?.message || "Unable to update notification.",
      );
    }
  };

  const handleMarkAllRead = async () => {
    dispatch(notificationActionStart("all"));
    try {
      await markAllNotificationsAsRead();
      dispatch(allNotificationsMarkedRead());
    } catch (requestError) {
      dispatch(
        notificationActionFailure(
          requestError.response?.data?.message ||
            "Unable to update notifications.",
        ),
      );
      showToast.error(
        requestError.response?.data?.message || "Unable to update notifications.",
      );
    }
  };

  const handleDelete = async (notificationId) => {
    dispatch(notificationActionStart(notificationId));
    try {
      await deleteNotification(notificationId);
      dispatch(notificationRemoved(notificationId));
    } catch (requestError) {
      dispatch(
        notificationActionFailure(
          requestError.response?.data?.message ||
            "Unable to delete notification.",
        ),
      );
      showToast.error(
        requestError.response?.data?.message || "Unable to delete notification.",
      );
    }
  };

  const handleDeleteAll = async () => {
    dispatch(notificationActionStart("delete-all"));
    try {
      const response = await deleteAllNotifications();
      dispatch(allNotificationsRemoved());
      setIsDeleteAllOpen(false);
      showToast.success(response.message || "All notifications deleted.");
    } catch (requestError) {
      dispatch(
        notificationActionFailure(
          requestError.response?.data?.message ||
            "Unable to delete notifications.",
        ),
      );
      showToast.error(
        requestError.response?.data?.message ||
          "Unable to delete notifications.",
      );
    }
  };

  const unreadCount = notifications.filter(({ isRead }) => !isRead).length;
  const Sidebar = user?.role === "recruiter" ? RecruiterDashboardSidebar : DashboardSidebar;
  const formatDate = (date) =>
    date
      ? new Intl.DateTimeFormat("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(date))
      : "Date unavailable";
  const getNotificationMeta = (type) => {
    if (type === "application_accepted") {
      return { label: "Application accepted", icon: PiCheckCircle, tone: "text-[#16734f] bg-[#e5f3eb]" };
    }
    if (type === "application_rejected") {
      return { label: "Application update", icon: FiXCircle, tone: "text-[#c34e42] bg-[#fbe3e0]" };
    }
    if (type === "application_submitted") {
      return { label: "New application", icon: FiBell, tone: "text-[#a9651c] bg-[#fff0d9]" };
    }
    return { label: "Notification", icon: FiClock, tone: "text-[#1f7a50] bg-[#e5f3eb]" };
  };

  if (isLoading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                  Updates
                </p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                  Notifications
                </h1>
                <p className="mt-3 text-sm text-[#69766e]">
                  {unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}` : "You are all caught up."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 self-start sm:self-auto">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={Boolean(actionId)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#cbd9ce] bg-white px-4 py-3 text-sm font-bold text-[#1f7a50] hover:bg-[#e5f3eb]"
                  >
                    <FiCheck /> {actionId === "all" ? "Updating..." : "Mark all as read"}
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsDeleteAllOpen(true)}
                    disabled={Boolean(actionId)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#f1c7c2] bg-white px-4 py-3 text-sm font-bold text-[#c34e42] hover:bg-[#fff6f4]"
                  >
                    <FiTrash2 /> Delete all
                  </button>
                )}
              </div>
            </header>
          </FadeIn>

          <section className="mt-8 space-y-3">
            {error ? (
              <FadeIn className="rounded-2xl border border-[#f0c6c0] bg-white px-6 py-14 text-center">
                <FiBell className="mx-auto text-[#c34e42]" size={28} />
                <h2 className="mt-5 font-serif text-3xl">Could not load updates</h2>
                <p className="mt-2 text-sm text-[#69766e]">{error}</p>
              </FadeIn>
            ) : notifications.length ? (
              notifications.map((notification) => (
                (() => {
                  const meta = getNotificationMeta(notification.type);
                  const Icon = meta.icon;
                  const jobPath = user?.role === "recruiter"
                    ? `/recruiter-job-detail/${notification.job?._id}`
                    : `/jobs/${notification.job?._id}`;
                  return (
                <FadeIn
                  key={notification._id}
                  className={`flex gap-4 rounded-2xl border p-5 ${notification.isRead ? "border-[#e2e7e1] bg-white" : "border-[#b9d9c3] bg-[#f7fcf8]"}`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.tone}`}>
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#819087]">{meta.label}</p>
                      <time className="text-xs text-[#9aa49d]" dateTime={notification.createdAt}>
                        {formatDate(notification.createdAt)}
                      </time>
                    </div>
                    <p className="text-sm leading-6 text-[#53615a]">{notification.message}</p>
                    {notification.job?.title && (
                      <Link to={jobPath} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#1f7a50] hover:text-[#185e3e]">
                        {notification.job.title} <FiExternalLink size={12} />
                      </Link>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {!notification.isRead && (
                        <button type="button" disabled={actionId === notification._id} onClick={() => handleMarkRead(notification._id)} className="text-xs font-bold text-[#1f7a50] hover:text-[#185e3e]">
                          {actionId === notification._id ? "Updating..." : "Mark as read"}
                        </button>
                      )}
                      <button type="button" disabled={actionId === notification._id} onClick={() => handleDelete(notification._id)} aria-label="Delete notification" className="inline-flex items-center gap-1 text-xs font-bold text-[#c34e42] hover:text-[#a33d34]">
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                </FadeIn>
                  );
                })()
              ))
            ) : (
              <FadeIn className="rounded-2xl border border-dashed border-[#cbd9ce] bg-white px-6 py-16 text-center">
                <FiBell className="mx-auto text-[#238457]" size={28} />
                <h2 className="mt-5 font-serif text-3xl">No notifications yet</h2>
                <p className="mt-2 text-sm text-[#69766e]">New application updates will appear here.</p>
              </FadeIn>
            )}
          </section>
        </div>
      </main>
      <ConfirmModal
        isOpen={isDeleteAllOpen}
        title="Delete all notifications?"
        message="Every notification will be permanently removed from your account."
        confirmLabel="Delete all"
        isLoading={actionId === "delete-all"}
        onCancel={() => setIsDeleteAllOpen(false)}
        onConfirm={handleDeleteAll}
      />
    </div>
  );
};

export default Notifications;