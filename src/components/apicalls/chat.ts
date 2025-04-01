/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

const BASE_URL = process.env.API_URL || "https://dev.sourcebytes.ai/api/v1"; // Fallback for safety

// interface SendMessageModel {
//   message: string;
//   conversation_id: string;
// }
export async function getHistory(token: string): Promise<any> {
  const url = `${BASE_URL}/chat/conversations/`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Fetching Admin failed",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export async function getConversasionTitle(token: string, conversasion_id: string): Promise<any> {
  const url = `${BASE_URL}/chat/conversations/${conversasion_id}/fetch-updated-conversation-title/`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Fetching Admin failed",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export async function getChatHistory(token: string, id: string): Promise<any> {
  const url = `${BASE_URL}/chat/conversations/${id}/`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Fetching Admin failed",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export async function deleteAllHistory(
  token: string,
  tenant_id: string
): Promise<any> {
  const url = `${BASE_URL}/chat/conversations/delete-all/?tenant_id=${tenant_id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Fetching Admin failed",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export async function deleteHistoryById(
  token: string,
  id: string,
  tenant_id: string
): Promise<any> {
  const url = `${BASE_URL}/chat/conversations/${id}/delete/?tenant_id=${tenant_id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Fetching Admin failed",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
// export async function sendChat(
//   token: string,
//   formData: SendMessageModel
// ): Promise<any> {
//   const url = `${BASE_URL}/chat/send/`;
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//       },
//       body: JSON.stringify(formData),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error: data.message || "Fetching organizations failed",
//       };
//     }

//     return { success: true, data };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Something went wrong",
//     };
//   }
// }

export interface SendMessageModel {
  message: string;
  conversation_id: string;
  tenant_id: string;
}

export async function sendChat(
  token: string,
  formData: SendMessageModel
): Promise<any> {
  const url = `${BASE_URL}/chat/send/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(formData),
    });

    // debugger
    // console.log(response);


    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Failed to send chat message",
      };
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return {
        success: false,
        error: "Unable to read response stream",
      };
    }

    let fullMessage = "";
    let finalResponse: any;
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // const parsedResponse = JSON.parse(fullMessage.trim());
        // const finalResponse = { full_response: parsedResponse.full_response };
        // console.log(finalResponse);
        break
      };

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      console.log(lines);

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          if (line.startsWith(`data: {"full_response"`)) {
            console.log(line.replace("data: ", "") + " ");
            finalResponse = JSON.parse(line.replace("data: ", "") + " ");
          }
          fullMessage += line.replace("data: ", "") + " ";
        }
      }
    }

    // console.log(fullMessage);


    return {
      success: true,
      data: finalResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
