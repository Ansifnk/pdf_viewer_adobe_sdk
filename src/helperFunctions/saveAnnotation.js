export const saveAnnotation = (annotation) => {
    try {
        localStorage.setItem('ANNOTATION', JSON.stringify(annotation))
    } catch (error) {
        console.log(error)
    }
}