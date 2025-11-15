import { Pen, Star, Trash } from "lucide-react";
import { InterfaceRating } from "../schemas/ratings";
import { fetchDeleteComment, fetchEditComment } from "../api/comments";
import { useEffect, useState } from "react";

export const CardComment = ({ comment, onCommentsUpdated }: { comment: InterfaceRating, onCommentsUpdated: () => void }) => {
  const [loadComment, setLoadComment] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (comment.comment) {
      setLoadComment(comment.comment.comment);
    }
  }, [])

  const handleDeleteComment = () => {
    const deleteComment = async () => {
      if (comment.comment && comment.comment._id) {
        await fetchDeleteComment({id: comment.comment._id});
        onCommentsUpdated();
      }
    }
    deleteComment();
  }

  const handleEditComment = () => {
    const editComment = async () => {
      if (comment.comment && comment.comment._id) {
        try {
          await fetchEditComment({id: comment.comment._id, comment: loadComment});
          onCommentsUpdated();
          setIsEditing(false);
        } catch (error) {
          setIsEditing(true);
        }
      }
    }
    editComment();
  }

  return (
    <div className="flex items-start gap-3 border-t border-gray-700 pt-3 my-2">
        {/** === User Avatar & Info === **/}
        <img className="w-10 h-10 rounded" src={comment.userInfo.user_pfp}/>
        
        {/** === Comment Content === **/}
        <div
          className="flex flex-col flex-1"
        >
          {/** User Name & Rating **/}
          <div className="flex justify-between">
            <p className="flex items-center text-sm font-semibold mb-1">
              {comment.userInfo.user_name} 
              <span className="flex text-yellow-400 ml-1">
                {Array.from({length: Number(comment.rate)}).map((_, i) => (
                  <Star key={i} className="w-3 h-3" fill="currentColor" />
                ))}
              </span>
            </p>
            {/** Delete and edit comment */}
            <div 
              className="
              flex items-center gap-2 text-gray-400 text-xs
              "
            >
              <Pen 
                className="size-4 stroke-blue-400 text-black fill-current cursor-pointer"
                onClick={() => setIsEditing(true)}
              />
              <Trash 
                className="size-4 stroke-red-300 text-black fill-current cursor-pointer"
                onClick={handleDeleteComment}
              />
            </div>
          </div>

          {/** Comment Text **/}
          {isEditing ? (          
            <div className="flex flex-col p-2">
              <textarea
                value={loadComment}
                onChange={(e) => setLoadComment(e.target.value)}
                className="text-sm text-gray-300 word-break break-word mb-4">
              </textarea>
              <button 
                onClick={handleEditComment} 
                className="p-2 bg-gray-700 self-start cursor-pointer rounded">
                <span>Confirmar</span>
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-300 break-words">
              {loadComment}
            </p>
          )}
        </div>
    </div>
  );
}

export default CardComment;