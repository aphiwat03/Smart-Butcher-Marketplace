import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    const result = await this.contactService.create(createContactDto);
    return {
      message: 'ส่งข้อความติดต่อสำเร็จ',
      data: result,
    };
  }
}
