import { useEffect, FC, useState } from "react";
import { Peer, DataConnection } from "peerjs";
import { toast } from "react-toastify";
import { Send } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Create: FC = () => {
  const [id, setId] = useState<string>("");
  const [messages, setMessages] = useState<
    Array<{ content: string; mine: boolean }> | undefined
  >(undefined);
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("waiting");
  const [conn, setConn] = useState<DataConnection | undefined>(undefined);
  const [bottomRef, setBottomRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const newPeer = new Peer({
      host: "localhost",
      port: 9000,
      path: "/peerify",
    });

    newPeer.on("open", (id: string) => {
      console.log("My peer ID is: " + id);
      setId(id);
    });

    newPeer.on("connection", (conn) => {
      setConn(conn);
      toast.success("User connected successfully!");
      setStatus("connected");
      conn.on("data", (data: unknown) => {
        if (typeof data === "string" && data.trim() !== "") {
          if (data.trim() === "") return;
          const newMessage = { content: data, mine: false };
          setMessages((prev) => [...(prev ?? []), newMessage]);
        }
      });
    });

    return () => {
      newPeer.destroy();
    };
  }, []);

  useEffect(() => {
    if (bottomRef) {
      bottomRef.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, bottomRef]);

  const handleMessage = () => {
    if (message.trim() === "") return;
    setMessage("");
    const newMessage = { content: message, mine: true };
    setMessages((prev) => [...(prev ?? []), newMessage]);
    conn?.send(message);
  };

  const copyId = () => {
    navigator.clipboard.writeText(id);
    toast.success("Copied to clipboard!");
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="flex flex-col w-1/2">
            <>
              <div>
                <Card className="w-full">
                  <CardHeader>
                    {status === "waiting" ? (
                      <>
                        <CardTitle>
                          Create chat{" "}
                          <Badge className="hover:cursor-default">
                            {status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Create a chat by sharing the id with your friend
                          <br />
                          <Badge
                            className="mt-2 hover:cursor-pointer"
                            onClick={copyId}
                          >
                            {id}
                          </Badge>
                        </CardDescription>
                      </>
                    ) : (
                      <>
                        <CardTitle>
                          Create chat <Badge>{status}</Badge>
                        </CardTitle>
                        <CardDescription>
                          Send messages to your friend
                        </CardDescription>
                      </>
                    )}
                  </CardHeader>

                  {status !== "waiting" && (
                    <CardContent>
                      <ScrollArea className="h-[200px] w-full">
                        <div className="pt-4">
                          {(messages ?? []).map((message, index) => (
                            <div
                              key={index}
                              className={
                                message?.mine ? "text-left" : "text-right"
                              }
                            >
                              <span
                                className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                                  message?.mine
                                    ? "bg-muted mt-1"
                                    : "bg-primary text-primary-foreground ml-auto mt-1"
                                }`}
                              >
                                {message?.content}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div ref={(el) => setBottomRef(el)} />
                      </ScrollArea>
                    </CardContent>
                  )}

                  {status !== "waiting" && (
                    <CardFooter className="flex justify-between">
                      <>
                        <Input
                          placeholder="Type your message..."
                          className="mr-2"
                          onChange={(e) => setMessage(e.target.value)}
                          value={message}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleMessage();
                          }}
                        />
                        <Button onClick={handleMessage} size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
