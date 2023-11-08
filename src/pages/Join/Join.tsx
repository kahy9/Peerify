import { useEffect, FC, useState } from "react";
import { Peer, DataConnection } from "peerjs";
import { toast } from "react-toastify";
import { PlusCircle, Send } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
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
  const [peer, setPeer] = useState<Peer>();
  const [destPeerId, setDestPeerId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("waiting");
  const [messages, setMessages] = useState<
    Array<{ content: string; mine: boolean }> | undefined
  >(undefined);
  const [conn, setConn] = useState<DataConnection | undefined>(undefined);

  useEffect(() => {
    const myPeer = new Peer({
      host: "localhost",
      port: 9000,
      path: "/peerify",
    });

    setPeer(myPeer);

    return () => {
      myPeer.destroy();
    };
  }, []);

  const connect = () => {
    if (peer) {
      const conn = peer.connect(destPeerId);
      setStatus("connected");
      toast.success("Successfully connected!");
      setConn(conn);

      conn.on("data", (data: unknown) => {
        if (typeof data === "string" && data.trim() !== "") {
          if (data.trim() === "") return;
          const newMessage = { content: data, mine: false };
          setMessages((prev) => [...(prev ?? []), newMessage]);
        }
      });
    }
  };

  const handleMessage = () => {
    if (message.trim() === "") return;
    setMessage("");
    const newMessage = { content: message, mine: true };
    setMessages((prev) => [...(prev ?? []), newMessage]);
    conn?.send(message);
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
                          Join chat{" "}
                          <Badge className="hover:cursor-default">
                            {status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Paste the ID of your friend to join the chat
                          <br />
                        </CardDescription>
                      </>
                    ) : (
                      <>
                        <CardTitle>
                          Join chat <Badge>{status}</Badge>
                        </CardTitle>
                        <CardDescription>
                          Send messages to your friend
                        </CardDescription>
                      </>
                    )}
                  </CardHeader>

                  {status !== "waiting" && (
                    <CardContent>
                      <>
                        <div className="pt-4">
                          {(messages ?? []).map((message, index) => (
                            <div
                              key={index}
                              className={
                                message?.mine ? "text-left" : "text-right"
                              }
                            >
                              <span
                                className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${message?.mine
                                  ? "bg-muted mt-1"
                                  : "bg-primary text-primary-foreground ml-auto mt-1"
                                  }`}
                              >
                                {message?.content}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    </CardContent>
                  )}

                  <CardFooter className="flex justify-between">
                    {status === "waiting" ? (
                      <>
                        <Input
                          placeholder="Type your friend's ID to join the chat..."
                          className="mr-2"
                          onChange={(e) => setDestPeerId(e.target.value)}
                          value={destPeerId}
                        />
                        <Button onClick={connect} size="icon">
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )
                      : (
                        <>
                          <Input
                            placeholder="Type your message..."
                            className="mr-2"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            onKeyDown={(e) => { if (e.key === "Enter") handleMessage() }}
                          />
                          <Button onClick={handleMessage} size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                        </>
                      )
                    }
                  </CardFooter>
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
