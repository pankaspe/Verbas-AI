export function ChatPanel() {
  return ( 
    <div class="bg-base-200 h-full">
      <h2 class="text-pretty md:text-balance px-4 pt-4 pb-2 text-primary">Mistral AI</h2>
    <div class="text-xs px-2">
      <div class="chat chat-start">
        <div class="chat-bubble chat-bubble-info">Heya, can you help me?</div>
      </div>
      <div class="chat chat-end">
        <div class="chat-bubble chat-bubble-neutral">Hello, I'am Mistral, your AI ghostwriter</div>
      </div>
      <div class="chat chat-start">
        <div class="chat-bubble chat-bubble-info">Great, can you fix my text please?</div>
      </div>
      <div class="chat chat-end">
        <div class="chat-bubble chat-bubble-neutral">Of course, let me analyze the files</div>
      </div>
      </div>
    </div>
  );}