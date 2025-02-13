import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { observer } from "mobx-react";
import DeleteIcon from "@mui/icons-material/Delete";

const DashboardEditProduct = observer(
    ({ product, onCancel, onSubmit, storeId }) => {
        const [existingImages, setExistingImages] = useState(
            product?.gallery.map((img) => ({
                id: img.id,
                imageLink: img.image_link,
            })) || [],
        );
        const [newImages, setNewImages] = useState([]);
        const [deleteImages, setDeleteImages] = useState([]); // IDs das imagens a excluir

        // Upload e remoção de imagens
        const handleImageUpload = (event) => {
            const files = Array.from(event.target.files);
            const base64Promises = files.map(
                (file) =>
                    new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result);
                    }),
            );

            Promise.all(base64Promises).then((base64Images) => {
                setNewImages([...newImages, ...base64Images]);
            });
        };

        const handleRemoveImage = (imageId, index, isNewImage) => {
            if (isNewImage) {
                setNewImages(newImages.filter((_, i) => i !== index));
            } else {
                if (imageId) {
                    setDeleteImages((prev) => [...prev, imageId]); // Marca o ID da imagem para exclusão
                }
                setExistingImages(existingImages.filter((_, i) => i !== index)); // Remove visualmente
            }
        };

        // Validação do formulário
        const validationSchema = Yup.object().shape({
            name: Yup.string().required("Nome do produto é obrigatório"),
            price: Yup.number().required("Preço é obrigatório"),
            discount: Yup.number()
                .min(0, "O desconto não pode ser negativo")
                .nullable(),
            stock: Yup.number()
                .min(0, "O stock não pode ser negativo")
                .required("Stock é obrigatório"),
            description: Yup.string().nullable(),
        });

        const formik = useFormik({
            initialValues: {
                name: product?.name || "",
                price: product?.price || "",
                discount: product?.discount || "",
                stock: product?.stock || "",
                description: product?.description || "",
            },
            validationSchema: validationSchema,
            validateOnMount: true,
            onSubmit: (values) => {
                const formData = {
                    ...values,
                    existingImages,
                    newImages,
                    deleteImages,
                };
                onSubmit(formData);
            },
        });

        return (
            <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{ mt: 3, pt: 3 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <TextField
                        label="Nome do Produto"
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        error={Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        fullWidth
                    />
                    <TextField
                        label="Preço"
                        name="price"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.price}
                        error={Boolean(formik.errors.price)}
                        helperText={formik.touched.price && formik.errors.price}
                        fullWidth
                    />
                    <TextField
                        label="Desconto (%)"
                        name="discount"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.discount}
                        error={Boolean(formik.errors.discount)}
                        helperText={
                            formik.touched.discount && formik.errors.discount
                        }
                        fullWidth
                    />
                    <TextField
                        label="Stock"
                        name="stock"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.stock}
                        error={Boolean(formik.errors.stock)}
                        helperText={formik.touched.stock && formik.errors.stock}
                        fullWidth
                    />
                    <TextField
                        label="Descrição"
                        name="description"
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        error={Boolean(formik.errors.description)}
                        helperText={
                            formik.touched.description &&
                            formik.errors.description
                        }
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Box>

                {/* Imagens Existentes */}
                <Typography variant="h6" sx={{ mt: 4 }}>
                    Imagens Existentes
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {existingImages.map((imageObj, index) => (
                        <Box
                            key={imageObj.id}
                            sx={{
                                position: "relative",
                                width: 100,
                                height: 100,
                            }}
                        >
                            <img
                                src={imageObj.imageLink}
                                alt={`Imagem ${index}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                            <IconButton
                                size="small"
                                sx={{ position: "absolute", top: 0, right: 0 }}
                                onClick={() =>
                                    handleRemoveImage(imageObj.id, index, false)
                                }
                            >
                                <DeleteIcon color="error" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                {/* Novas Imagens */}
                <Typography variant="h6" sx={{ mt: 4 }}>
                    Novas Imagens
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {newImages.map((image, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: "relative",
                                width: 100,
                                height: 100,
                            }}
                        >
                            <img
                                src={image}
                                alt={`Nova Imagem ${index}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                            <IconButton
                                size="small"
                                sx={{ position: "absolute", top: 0, right: 0 }}
                                onClick={() =>
                                    handleRemoveImage(null, index, true)
                                }
                            >
                                <DeleteIcon color="error" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        mt: 4,
                    }}
                >
                    <Button variant="contained" component="label">
                        Adicionar Imagens
                        <input
                            type="file"
                            hidden
                            multiple
                            onChange={handleImageUpload}
                        />
                    </Button>
                    <Button type="submit" variant="contained">
                        Guardar
                    </Button>
                    <Button onClick={onCancel} variant="contained">
                        Cancelar
                    </Button>
                </Box>
            </Box>
        );
    },
);

export default DashboardEditProduct;
