import { useMutation } from "@tanstack/react-query";

interface ShareClipboardData extends Omit<ShareData, "files"> {
  text: string;
}

export const useClipboardMutation = () => {
  return useMutation((data: ShareClipboardData) => {
    if (navigator.share) return navigator.share(data);

    return navigator.clipboard.writeText(data.text);
  });
};
