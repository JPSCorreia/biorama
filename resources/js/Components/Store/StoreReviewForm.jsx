import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";
import Rating from "@mui/material/Rating";
import { usePage, router } from "@inertiajs/react";
import { shopStore } from "../../Stores";


const StoreReviewForm = ({user, vendor}) => {
    const formik = useFormik({
        initialValues: {
            store_id: usePage().props.store.id,
            user_id: usePage().props.auth.user.id,
            rating: 0,
            comment: "",
        },
        validationSchema: Yup.object({
            rating: Yup.number().min(1, "Escolha uma classificação").required(),
            comment: Yup.string().required("O comentário é obrigatório"),
        }),
        onSubmit: (values, { resetForm }) => {
            router.post("/adicionar-comentario", values, {
                onSuccess: () => {
                    resetForm();
                },
            });
        },
    });

    return (
        <Box sx={{ maxWidth: "100%", p: 2 }}>
            <Typography variant="h5" fontWeight="bold" sx={{mb:2}}>Dê a sua opinião sobre esta loja</Typography>


            <form onSubmit={formik.handleSubmit}>
                {/* Rating */}
                <Rating
                    name="rating"
                    value={formik.values.rating}
                    onChange={(_, newValue) => formik.setFieldValue("rating", newValue)}
                />
                {formik.errors.rating && <Typography color="error">{formik.errors.rating}</Typography>}

                {/* Comentário */}
                <TextField
                    fullWidth
                    label="Escreva o seu comentário"
                    multiline
                    rows={5}
                    margin="normal"
                    name="comment"
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.comment && Boolean(formik.errors.comment)}
                    helperText={formik.touched.comment && formik.errors.comment}
                />

                {/* Botão de Envio */}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Enviar Comentário
                </Button>
            </form>
        </Box>
    );
};

export default StoreReviewForm;
