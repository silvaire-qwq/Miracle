declare module "exif-parser" {
  interface ImageSize {
    width: number;
    height: number;
  }

  interface Tags {
    DateTimeOriginal?: string;
    CreateDate?: string;
    DateTimeDigitized?: string;
    ModifyDate?: string;
    Make?: string;
    Model?: string;
    LensModel?: string;
    LensMake?: string;
    FocalLength?: number;
    FocalLengthIn35mmFormat?: number;
    FNumber?: number;
    ExposureTime?: number;
    ShutterSpeedValue?: number;
    ISOSpeedRatings?: number;
    ISO?: number;
    [key: string]: any;
  }

  interface ParserResult {
    imageSize: ImageSize;
    tags?: Tags;
    [key: string]: any;
  }

  interface ExifParserStatic {
    create(buffer: Buffer): {
      parse(): ParserResult;
    };
  }

  const ExifParser: ExifParserStatic;
  export = ExifParser;
}
