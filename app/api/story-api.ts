import { ProgressResponse } from "../learn/page";
import { Story } from "../types/story";
import { UpdateProgressRequest } from "../types/UpdateProgressRequestDto";
import { apiRequest } from "./base-api";

export const getStoryByTitle = async (title: string) => {
    try {
        const encodedTitle = encodeURIComponent(title);

        const story = await apiRequest<Story>(`/stories/get-story/${encodedTitle}`,
            { method: 'GET' }
        );

        return story;
    } catch (error) {
        console.error("Error fetching story:", error);
        return null;
    }
};

export const entrollToStory = async (storyId: string) => {
    try {
        const progressData = await apiRequest<ProgressResponse>(
            `/progress/start/${storyId}`,
            { method: 'POST' }
        );
        return progressData;
    } catch (error) {
        console.error("Error enrolling to story:", error);
        throw error;
    }
}

export const updateProgress = async (payload: UpdateProgressRequest) => {
  return apiRequest(`/progress/update`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
