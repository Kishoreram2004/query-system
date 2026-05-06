import { apiRequest } from "./api";

export const addQuery = async (query) => {
  const payload = await apiRequest("/api/queries", {
    method: "POST",
    body: JSON.stringify(query)
  });

  return payload.query;
};

export const getQueries = async () => {
  const payload = await apiRequest("/api/queries");
  return payload.queries;
};

export const updateQueryStatus = async (id, status) => {
  const payload = await apiRequest(`/api/queries/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });

  return payload.query;
};

export const deleteQueryAndComments = async (queryId) => {
  await apiRequest(`/api/queries/${queryId}`, {
    method: "DELETE"
  });
};

export const getQueryById = async (id) => {
  const payload = await apiRequest(`/api/queries/${id}`);
  return payload.query;
};

export const addComment = async (queryId, text) => {
  const payload = await apiRequest(`/api/queries/${queryId}/comments`, {
    method: "POST",
    body: JSON.stringify({ text })
  });

  return payload.comment;
};

export const deleteComment = async (queryId, commentId) => {
  await apiRequest(`/api/queries/${queryId}/comments/${commentId}`, {
    method: "DELETE"
  });
};
