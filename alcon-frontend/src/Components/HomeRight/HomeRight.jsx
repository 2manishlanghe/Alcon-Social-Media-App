import React from "react";
import SuggestionsUserCard from "./SuggestionsUserCard";
import { Divider } from "@chakra-ui/react";
const HomeRight = ({ suggestedUser }) => {
  return (
    <div className="z-[0]">
      <div className="ml-20 mt-3">
        <div className="flex justify-between py-3 px-1 items-center">
          <p className="font-bold text-gray-700">Suggested for you</p>
        </div>

        <div className="space-y-5 z-[0]">
          {suggestedUser.map((item, index) => (
            <SuggestionsUserCard
              key={index}
              image={
                item.userImage ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              username={item.username}
              userid={item.id}
              description={"Follows you"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeRight;
