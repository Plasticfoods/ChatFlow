import Menu from "./Menu"
import ChatList from "./ChatList"
import ChatWindow from "./ChatWindow"
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { chatData, groupChatData } from './tempData.js';
import AddChatSection from "./AddChatSection";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeChat, setActiveChat] = useState(null);
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
                <ChatList chats={chatData} activeChat={activeChat} setActiveChat={setActiveChat} setShowAddChatSection={setShowAddChatSection} />}
            <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} />
        </div>
    )
}
