interface ChatBubbleProps {
    type: "chat" | "wrong-guess" | "correct-guess" | "system"
    author?: string
    content?: string
}

export function ChatBubble({type, author, content}: ChatBubbleProps) {
    const styles = {
        chat: {
            author: "",
            content: "",
        },
        "wrong-guess": {
            author: "",
            content: "",
        },
        "correct-guess": {
            author: "text-green-700 dark:text-green-400",
            content: "text-green-700 dark:text-green-400",
        },
        system: {
            author: "text-muted-foreground",
            content: "text-center text-xs text-muted-foreground font-medium",
        },
    }

    const currentStyle = styles[type]

    return (
        <div className="flex flex-col">
            {author && (
                <span className={`text-xs font-semibold ${currentStyle.author}`}>
                    {author}
                </span>
            )}
            <span className={`text-sm leading-relaxed ${currentStyle.content}`}>
                {type === "correct-guess" ? "guessed the word!" : content}
            </span>
        </div>
    )
}
