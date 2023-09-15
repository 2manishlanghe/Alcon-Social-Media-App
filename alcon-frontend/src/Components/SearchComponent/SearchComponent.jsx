import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../../Config/Debounce";
import { searchUserAction } from "../../Redux/User/Action";
import { searchHashtagAction } from "../../Redux/Hashatg/Action"; 
import "./SearchComponent.css";
import SearchUserCard from "./SearchUserCard";
import HashatgCard from "./HashtagCard";

const SearchComponent = ({ setIsSearchVisible }) => {
  const [query, setQuery] = React.useState("");
  const token = localStorage.getItem("token");
  const { user, hashtag } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleSearchUser = (query) => {
    const data = {
      jwt: token,
      query,
    };
    dispatch(searchUserAction(data));
  };

  const handleSearchHashtag = (query) => {
    const hashtagValue = query.substring(1);
    const data = {
      jwt: token,
      hashtag: hashtagValue,
    };
    dispatch(searchHashtagAction(data));
  };

  const debouncedHandleSearchUser = debounce(handleSearchUser, 1000);
  const debouncedHandleSearchHashtag = debounce(handleSearchHashtag, 1000);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setQuery(query); 
    if (query.startsWith("#")) {
      debouncedHandleSearchHashtag(query);
    } else {
      debouncedHandleSearchUser(query);
    }
  };

  return (
    <div className="search-container">
      <div className="px-3 pb-5">
        <h1 className="text-xl pb-5">Search</h1>
        <input
          onChange={handleInputChange}
          className="search-input"
          type="text"
          placeholder="Search..."
        />
      </div>
      <hr />
      <div className="px-3 pt-2">
        {query.startsWith("#") ? (
          hashtag.searchResult &&
          hashtag.searchResult.map((item) => (
            <HashatgCard
              setIsSearchVisible={setIsSearchVisible}
              key={item.id}
              hashtag={item.name}
            />
          ))
        ) : user.searchResult && user.searchResult.length > 0 ? (
          user.searchResult.map((item) => (
            <SearchUserCard
              setIsSearchVisible={setIsSearchVisible}
              key={item.id}
              username={item.username}
              image={item?.image}
            />
          ))
        ) : (
          <p>No user found</p>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
