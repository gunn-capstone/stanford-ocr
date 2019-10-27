import com.google.cloud.vision.v1.*;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.Feature.Type;
import com.google.protobuf.ByteString;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class Detect {
    public static void main(String[] args) throws Exception { // dont use absolute paths >:(
        String input = System.getProperty("user.dir");
        if (args.length > 0 && args[0] != null) {
            input += args[0];
        } else {
            input += "/src/main/resources/image 3.jpg";
            System.out.println("No input file specified, default(" + input + ") set as input");
        }

        String output = System.getProperty("user.dir");
        if (args.length > 0 && args[1] != null) {
            output += args[1];
        } else {
            output += "/src/main/resources/output.txt";
            System.out.println("No output file specified, default(" + output + ") set as output");
        }

        try {
            detectText(input, new PrintStream(output));
        } catch (FileNotFoundException e) {
            File outputFile = new File(output);
            if (outputFile.createNewFile()) {
                System.out.println(input + " does not exist");
                throw e;
            } else {
                detectText(input, new PrintStream(output));
            }
        }

    }


    private static File cropImage(Rectangle rect, String pathFile) throws Exception {
        BufferedImage image = ImageIO.read(new File(pathFile)).getSubimage(rect.x, rect.y, rect.width, rect.height);

        File outputFile = new File("image.jpg");
        ImageIO.write(image, "jpg", outputFile);
        try {


            image.getGraphics().drawLine(1, 1, image.getWidth() - 1, image.getHeight() - 1);
            image.getGraphics().drawLine(1, image.getHeight() - 1, image.getWidth() - 1, 1);

            ImageIO.write(image, "jpg", new File("./resources/untitled.jpg"));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return outputFile;
    }


    private static void detectText(String filePath, PrintStream out) throws Exception {
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
    }
}