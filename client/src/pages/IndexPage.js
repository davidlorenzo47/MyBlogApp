import { useEffect, useState } from "react";
import Post from "../Post";

export default function  IndexPage() {

    // creating a state
    const [posts, setPosts] = useState([]); //default will be an empty array in useState

    
    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {

            //this is the response that we get
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);
    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post} />  //passing all the properties from post to Post component
            ))}
        </>
    );
}