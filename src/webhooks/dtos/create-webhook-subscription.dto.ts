import {
  IsString,
  IsUrl,
  IsArray,
  IsOptional,
  IsBoolean,
  IsInt,
  IsObject,
  MinLength,
  Min,
} from 'class-validator';

export class CreateWebhookSubscriptionDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsUrl()
  url: string;

  @IsArray()
  @IsString({ each: true })
  events: string[];

  @IsOptional()
  @IsString()
  secret?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxRetries?: number;

  @IsOptional()
  @IsInt()
  @Min(1000)
  timeoutMs?: number;

  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;
}
