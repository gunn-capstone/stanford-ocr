import com.google.cloud.vision.v1.*;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.Feature.Type;
import com.google.protobuf.ByteString;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

public class Detect {
    public static void main(String[] args) throws Exception {
        detectText(System.getProperty("user.dir") + "/src/main/resources/image1.jpeg", System.out);
    }

    private BufferedImage cropImage(BufferedImage src, Rectangle rect, int x, int y) {
        return src.getSubimage(x, y, rect.width, rect.height);
    }

    public static void detectText(String filePath, PrintStream out) throws Exception, IOException {
        List<AnnotateImageRequest> requests = new ArrayList<>();

        ByteString imgBytes = ByteString.readFrom(new FileInputStream(filePath));

        Image img = Image.newBuilder().setContent(imgBytes).build();
        Feature feat = Feature.newBuilder().setType(Type.TEXT_DETECTION).build();
        AnnotateImageRequest request =
                AnnotateImageRequest.newBuilder().addFeatures(feat).setImage(img).build();
        requests.add(request);

        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
            List<AnnotateImageResponse> responses = response.getResponsesList();

            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    out.printf("Error: %s\n", res.getError().getMessage());
                    return;
                }

                // For full list of available annotations, see http://g.co/cloud/vision/docs
                for (EntityAnnotation annotation : res.getTextAnnotationsList()) {
                    out.printf("Text: %s\n", annotation.getDescription());
                    out.printf("Position : %s\n", annotation.getBoundingPoly());
                }
            }
        }
        catch (IOException e){
            System.out.println("Credentials not detected, see discord for .json");
            e.printStackTrace();
            System.exit(1);
        }
    }
}