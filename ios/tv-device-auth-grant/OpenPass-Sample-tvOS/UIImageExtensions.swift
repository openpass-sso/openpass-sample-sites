import UIKit

extension UIImage {

    /// Produces a QR code image representation of a url
    static func qrCode(url: String) -> UIImage? {
        guard let data = url.data(using: String.Encoding.ascii) else {
            return nil
        }
        let filter = CIFilter.qrCodeGenerator()
        filter.message = data
        filter.correctionLevel = "M"

        let transform = CGAffineTransform(scaleX: 10, y: 10)
        guard let output = filter.outputImage?.transformed(by: transform) else {
            return nil
        }
        // The filter's outputImage isn't suitable for rendering as-is. Convert to PNG and back.
        return UIImage(ciImage: output)
            .pngData()
            .flatMap(UIImage.init(data: ))
    }
}
