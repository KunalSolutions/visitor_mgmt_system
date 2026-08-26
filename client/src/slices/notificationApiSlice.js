import { NOTIFICATIONS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const notificationApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotifications: builder.query({
			query: () => ({
				url: NOTIFICATIONS_URL,
			}),
			providesTags: ['Notification'],
			keepUnusedDataFor: 5,
		}),

		getNotificationById: builder.query({
			query: (notificationId) => ({
				url: `${NOTIFICATIONS_URL}/${notificationId}`,
			}),
			providesTags: ['Notification'],
			keepUnusedDataFor: 5,
		}),

		markNotificationAsRead: builder.mutation({
			query: (notificationId) => ({
				url: `${NOTIFICATIONS_URL}/${notificationId}/read`,
				method: 'PUT',
			}),
			invalidatesTags: ['Notification'],
		}),

		deleteNotification: builder.mutation({
			query: (notificationId) => ({
				url: `${NOTIFICATIONS_URL}/${notificationId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Notification'],
		}),
	}),
});

export const {
	useGetNotificationsQuery,
	useGetNotificationByIdQuery,
	useMarkNotificationAsReadMutation,
	useDeleteNotificationMutation,
} = notificationApiSlice;