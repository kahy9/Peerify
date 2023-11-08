import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home: FC = () => {
  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-center">
              Welcome to Peerify
            </h1>
            <h2 className="text-1xl text-center p-2">
              Peer to peer chat application
            </h2>
            <div className="flex justify-center p-1">
              <Link to="create" className="mr-2">
                <Button variant="outline">Create Call</Button>
              </Link>
              <Link to="join">
                <Button variant="outline">Join Call</Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <Link to="https://github.com/kahy9" className="mr-2">
                <Button variant="link">Made with &hearts; by kahy</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
