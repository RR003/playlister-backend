function Comment(props) {
  let selectClass = "unselected-list-card";
  let { comment } = props;
  console.log(comment);
  return (
    <div className={selectClass}>
      {comment.comment} - {comment.name}
    </div>
  );
}

export default Comment;
