import { VISITORS_URL } from '../constants';

import { apiSlice } from './apiSlice';

export const visitorApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createVisitor: builder.mutation({
			query: (data) => ({
				url: `${VISITORS_URL}`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Visitor'],
		}),

		getVisitors: builder.query({
			query: () => ({
				url: `${VISITORS_URL}`,
			}),
			providesTags: ['Visitor'],
			keepUnusedDataFor: 5,
		}),

		getResidents: builder.query({
			query: () => ({
				url: `${USERS_URL}/residents`,
			}),
			providesTags: ['User'],
			keepUnusedDataFor: 5,
		}),

		getVisitorDetails: builder.query({
			query: (visitorId) => ({
				url: `${VISITORS_URL}/${visitorId}`,
			}),
			providesTags: ['Visitor'],
			keepUnusedDataFor: 5,
		}),

		updateVisitorStatus: builder.mutation({
			query: ({ visitorId, status, remark }) => ({
				url: `${VISITORS_URL}/${visitorId}/status`,
				method: 'PUT',
				body: {
					status,
					remark,
				},
			}),
			invalidatesTags: ['Visitor'],
		}),

		deleteVisitor: builder.mutation({
			query: (visitorId) => ({
				url: `${VISITORS_URL}/${visitorId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Visitor'],
		}),
	}),
});

export const {
	useCreateVisitorMutation,
	useGetVisitorsQuery,
	useGetResidentsQuery,
	useGetVisitorDetailsQuery,
	useUpdateVisitorStatusMutation,
	useDeleteVisitorMutation,
} = visitorApiSlice;