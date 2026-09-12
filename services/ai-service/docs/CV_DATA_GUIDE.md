# CV DATA GUIDE
RDD2022: 47,420 images, >55,000 damage instances, 4 road-damage classes.
TACO: trash detection annotations.
Civic Issue Detection: garbage, cracks/roads, manholes, potholes.

For the SIH demo, do not download the full 12+ GB RDD2022 dataset into the web server.
Download a small training subset in a separate training environment, train YOLO,
then place the resulting weights in a model folder and replace the offline fallback
inside `/api/image-validate`.

The API contract stays the same.
