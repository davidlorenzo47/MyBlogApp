import {formatISO9075} from "date-fns";
import { displayName } from "react-quill";
import {Link} from "react-router-dom";

//grabbing all the information about post
export default function Post({_id,title,summary,cover,content,createdAt,author}) {
    return (
        <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={'http://localhost:4000/'+cover} alt=""/>
        </Link>
      </div>
      <div className="texts">
        <Link  to={`/post/${_id}`}>
            <h2>{title} </h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          {/* We have 2 ways to display date, first one would be to display how many hours ago or days ago the user has posted an article or to diplsay the date directly when the user publishes the article. 
          Using date-fns, which has function "formatISO9075" to display date, we display date. */}
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
    );
}