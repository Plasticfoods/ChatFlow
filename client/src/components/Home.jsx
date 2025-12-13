import Menu from "./Menu"
import ChatList from "./ChatList"
import ChatWindow from "./ChatWindow"
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { chatData } from './tempData.js';
import AddChatSection from "./AddChatSection";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeChatId, setActiveChatId] = useState(null);
    const [showAddChatSection, setShowAddChatSection] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Show loader for 2 seconds

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <Loader message="Loading Chats..." overlay={true} />;
    }

    return (
        <div className="home" style={{ position: 'relative' }}>
            <Menu />
            {showAddChatSection ? <AddChatSection chats={chatData} setShowAddChatSection={setShowAddChatSection} /> :
                <ChatList chats={chatData} activeChatId={activeChatId} setActiveChatId={setActiveChatId} setShowAddChatSection={setShowAddChatSection} />}
            <ChatWindow activeChatId={activeChatId} setActiveChatId={setActiveChatId} />
        </div>
    )
}
