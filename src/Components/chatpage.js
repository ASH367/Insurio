import { useLocation } from 'react-router-dom';
import Left from "./Left.js"
import Middle from "./Middle.js"
import Right from "./Right.js"
import { form } from 'framer-motion/client';

function ChatPage() {
    const location = useLocation();
    const formData = location.state || {};
  console.log("Received in ChatPage:", formData);

  return (
    <div style={{display:"flex", justifyContent:"space-between", backdropFilter: 'blur(8px)'}}>
      <Left formData={formData} />
      <Middle formData={formData} />
      <Right formData={formData} />
    </div>
  );
}

export default ChatPage;