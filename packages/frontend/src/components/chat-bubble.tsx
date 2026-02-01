interface ChatBubbleProps {
    type: "chat" | "wrong-guess" | "correct-guess"
    author: string
    content?: string
}

export function ChatBubble({type, author, content}: ChatBubbleProps) {
    if (type === "chat") {
        return (
            <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                <span className="text-foreground font-semibold">{author}:</span>{" "}
                <span className="text-foreground/90">{content}</span>
            </div>
        )
    }

    if (type === "wrong-guess") {
        return (
            <div className="rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
                <span className="font-semibold">{author}</span> guessed{" "}
                <span className="font-medium">{content}</span>
            </div>
        )
    }

    if (type === "correct-guess") {
        return (
            <div className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                {author} guessed the word!
            </div>
        )
    }

    return null
}
