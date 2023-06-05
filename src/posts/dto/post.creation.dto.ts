import { OwnerInfoDto } from '../../blogs/dto/owner.info.dto';

export class PostCreationDto {
  title: string;
  shortDescription: string;
  content: string;
  ownerInfo: OwnerInfoDto;
  blogId: string;
  blogName: string;
}
