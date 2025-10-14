export class CreateGroupDto{
    name : string;
    
}

export class MappedUserGroupDto {
  id: string;
  user_id: string;
  group_id: string;
  createdAt: Date; 
}

export class GroupCreatedDto {
  id: string;
  name: string;
  admin_user: string;
  admin_name: string;
  createdAt: Date; 
}

export class CreateGroupResponseDto {
  mappedUserGroup: MappedUserGroupDto;
  groupCreated: GroupCreatedDto;
}