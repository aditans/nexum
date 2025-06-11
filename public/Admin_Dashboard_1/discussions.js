let replyingToId = null; // Tracks the discussion_id being replied to
  let replyingToName = "";

  // When a reply button is clicked
  
  // Cancel reply
  document.getElementById('cancel-reply').addEventListener('click', () => {
    replyingToId = null;
    replyingToName = '';
    document.getElementById('replying-to').style.display = 'none';
  });

  // Handle form submission
  document.querySelector('.chat-input-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.querySelector('.chat-input');
    const message = input.value.trim();
    const userId = localStorage.getItem('user_id');// Replace with logged-in user ID

    if (!message) return;

    if (replyingToId) {
      // It's a reply
      await fetch('http://localhost:5001/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discussion_id: replyingToId,
          user_id: userId,
          answer: message
        })
      });
      location.reload();
    } else {
      // It's a new discussion
      await fetch('http://localhost:5001/discussion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          message: message
        })
      });
      location.reload();
    }

    // Reset
    input.value = '';
    replyingToId = null;
    replyingToName = '';
    document.getElementById('replying-to').style.display = 'none';

    // Optionally: reload messages or update UI dynamically
  });

  // This function extracts discussion_id — depends on your data structure
  function getDiscussionIdFromThread(threadEl) {
    // You can store discussion_id in a data attribute:
    // <div class="thread" data-discussion-id="3">
    return threadEl.dataset.discussionId;
  }



  document.addEventListener("DOMContentLoaded", () => {
    loadMessages();
    
  });
  
  async function loadMessages() {
    const container = document.querySelector(".chat-messages");
    container.innerHTML = "";
  
    try {
      const res = await fetch("http://localhost:5001/api/discussions");
      const threads = await res.json();
  
      threads.forEach(thread => {
        const threadEl = document.createElement("div");
        threadEl.classList.add("thread");
        threadEl.dataset.discussionId = thread.discussion_id;
  
        const discussionHTML = `
          <div class="message blue-bg" style="position: relative;">
            <div class="message-sender">
              ${thread.sender} ${getRoleBadge(thread.role)}
            </div>
            <div class="message-text">${thread.message}</div>
            <div class="message-timestamp">${formatTime(thread.timestamp)}</div>
            <button class="reply-button" style="height: 40px; width: 70px; border-radius: 10px; display: flex; align-items: center; justify-content: center; position: absolute; right:70px; bottom: -10px;">
              <div>reply</div>
              <span class="material-symbols-outlined">keyboard_return</span>
            </button>
          </div>
        `;
  
        const repliesHTML = thread.replies.map(r => `
          <div class="message-sender">
            ${r.sender} ${getRoleBadge(r.role)}
          </div>
          <div class="message-text">${r.message}</div>
          <div class="message-timestamp">${formatTime(r.timestamp)}</div>
          <div class="line"></div>
        `).join("");
  
        threadEl.innerHTML = `
          ${discussionHTML}
          <div class="reply-thread">
            <div class="message-reply">
              ${repliesHTML}
            </div>
          </div>
        `;
  
        container.appendChild(threadEl);
      });
  
      bindReplyButtons();
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  }
  
  function getRoleBadge(role) {
    const roleColors = {
      admin: "red",
      student: "cyan",
      faculty: "greenyellow"
    };
    return role ? `<span style="color: ${roleColors[role]}; font-style: italic;">(${role})</span>` : "";
  }
  
  
  // Simple time formatter
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  function bindReplyButtons() {
    document.querySelectorAll('.reply-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const thread = btn.closest('.thread');
        const discussionId = thread.dataset.discussionId;
        const sender = thread.querySelector('.message-sender')?.innerText;
  
        replyingToId = discussionId;
        replyingToName = sender;
  
        document.getElementById('replying-to').style.display = 'block';
        document.getElementById('replying-to-name').textContent = sender;
      });
    });
  }