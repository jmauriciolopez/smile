import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatalogoPlanesService } from './catalogo-planes.service';

@Controller('catalogo-planes')
export class CatalogoPlanesController {
  constructor(private readonly catalogoPlanesService: CatalogoPlanesService) {}

  @Post()
  create(@Body() createCatalogoPlaneDto: any) {
    return this.catalogoPlanesService.create(createCatalogoPlaneDto);
  }

  @Get()
  findAll() {
    return this.catalogoPlanesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoPlanesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatalogoPlaneDto: any) {
    return this.catalogoPlanesService.update(id, updateCatalogoPlaneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogoPlanesService.remove(id);
  }
}
