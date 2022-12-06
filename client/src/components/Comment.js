function Comment(props) {
  let cardClass = "list-card unselected-list-card";
  let { comment } = props;
  console.log(comment);
  return (
    <div className={cardClass}>
      {comment.comment} by {comment.name}
    </div>
  );
}

export default Comment;
