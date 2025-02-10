import { useState } from "react";
import { Box, Typography, Avatar, Link } from "@mui/material";
import Rating from "@mui/material/Rating";

const StoreReviewsList = ({ reviews }) => {
    const [visibleCount, setVisibleCount] = useState(5);
    const [expandedComments, setExpandedComments] = useState({});

    const toggleExpand = (id) => {
        setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Box sx={{ maxWidth: "90%", p: 2 }}>
            <Typography variant="h5" fontWeight="bold" sx={{mb:2}}>O que dizem sobre esta loja</Typography>
            {reviews.reverse().slice(0, visibleCount).map((review) => (
                <Box key={review.id} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <Avatar src={review.user.avatar} sx={{ mr: 2 }} />
                    <Box sx={{width:"100%"}}>
                        <Box sx={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {review.user.first_name + " " + review.user.last_name}
                                </Typography>
                                <Typography variant="caption" color="gray">
                                    {review.timestamp}
                                </Typography>
                            </Box>
                            <Rating value={review.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, width:"100%" }}>
                            {expandedComments[review.id] || review.comment.length <= 100
                                ? review.comment
                                : review.comment.substring(0, 100) + "..."}
                            {review.comment.length > 100 && (
                                <Link
                                    size="small"
                                    onClick={() => toggleExpand(review.id)}
                                    sx={{ textTransform: "none", ml: 1 }}
                                >
                                    {expandedComments[review.id] ? "Ver menos" : "Ver mais"}
                                </Link>
                            )}
                        </Typography>
                    </Box>
                </Box>
            ))}

            {reviews.reverse().length > visibleCount && (
                <Box sx={{ textAlign: "right" }}>
                    <Link onClick={() => setVisibleCount(visibleCount + 5)} sx={{ mt: 2, cursor:"pointer" }}>
                        Ver mais comentários
                    </Link>
                </Box>
            )}
        </Box>
    );
};

export default StoreReviewsList;
