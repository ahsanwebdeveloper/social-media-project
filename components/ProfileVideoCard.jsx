import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useLike from "../hooks/useLike";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function ProfileVideoCard({ video, videoUrl, thumbnailUrl, title, description }) {
  const { liked, likesCount, handleLike } = useLike(video._id);
  return (
    <Card>
      <CardMedia
        component="video"
        src={videoUrl}
        poster={thumbnailUrl}
        controls
        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
      />
      <CardContent>
         <IconButton sx={{ color: "white", flexDirection:"column" }} onClick={handleLike}>
  {liked ? (
    <FavoriteIcon fontSize="large" color="error" />
  ) : (
    <FavoriteIcon fontSize="large" />
  )}
  <Typography variant="span" color="black">{ likesCount}</Typography>
</IconButton>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
