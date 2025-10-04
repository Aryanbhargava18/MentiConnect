import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User, Mail, Calendar, Code, Users } from 'lucide-react';

const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="h-16 w-16 rounded-full border-2 border-gray-200"
          />
          <div>
            <CardTitle className="text-xl">{user.username}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Role:</span>
            <span className="text-sm capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {user.role}
            </span>
          </div>
          
          {user.skills && user.skills.length > 0 && (
            <div className="flex items-start space-x-2">
              <Code className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <span className="text-sm font-medium">Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {user.mentoringCapacity > 0 && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Mentoring Capacity:</span>
              <span className="text-sm">{user.mentoringCapacity} mentees</span>
            </div>
          )}

          {user.availability && user.availability.length > 0 && (
            <div className="flex items-start space-x-2">
              <Calendar className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <span className="text-sm font-medium">Availability:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.availability.map((slot, index) => (
                    <span
                      key={index}
                      className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {user.acceptedMatches && user.acceptedMatches.length > 0 && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium">Active Matches:</span>
              <span className="text-sm">{user.acceptedMatches.length}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
