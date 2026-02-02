import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function ProfileVideoCard({ video, videoUrl, thumbnailUrl, title, description }) {
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
