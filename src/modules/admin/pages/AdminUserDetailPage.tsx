import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useAdminUserCompleteData,
  useAdminUserTokenBalance,
  useAdminUserTokenTopUp,
  useAdminUserTokenReset,
} from '@/services/admin/hook';
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Coins,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [tokensToAdd, setTokensToAdd] = useState('');

  const { data: userData, isLoading } = useAdminUserCompleteData(userId || '', !!userId);
  const { data: tokenBalance, isLoading: isLoadingTokens } = useAdminUserTokenBalance(
    userId || '',
    !!userId
  );

  const tokenTopUpMutation = useAdminUserTokenTopUp();
  const tokenResetMutation = useAdminUserTokenReset();

  const handleAddTokens = async () => {
    if (!userId || !tokensToAdd) {
      toast.error('Please enter a valid number of tokens');
      return;
    }

    const tokens = parseInt(tokensToAdd, 10);
    if (isNaN(tokens) || tokens <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    try {
      await tokenTopUpMutation.mutateAsync({
        userId,
        request: { tokens_to_add: tokens },
      });
      setTokensToAdd('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleResetTokens = async () => {
    if (!userId) return;

    if (!confirm('Are you sure you want to reset this user\'s tokens?')) {
      return;
    }

    try {
      await tokenResetMutation.mutateAsync(userId);
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">User not found</p>
        <Button onClick={() => navigate('/admin')} className="mt-4">
          Back to Users
        </Button>
      </div>
    );
  }

  const { user, profile, education, experiences, certifications, skills, languages, links, projects, custom_sections } = userData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-muted-foreground mt-1">{user.email}</p>
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.phone && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                Role
              </div>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Status
              </div>
              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                {user.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Verification
              </div>
              {user.is_verified ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <XCircle className="h-3 w-3 mr-1" />
                  Unverified
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created At
              </div>
              <p className="font-medium">
                {new Date(user.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Balance
          </CardTitle>
          <CardDescription>Manage user's AI feature tokens/points</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTokens ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : tokenBalance ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tokens Remaining</p>
                  <p className="text-2xl font-bold">{tokenBalance.tokens_remaining}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Tokens Used</p>
                  <p className="text-2xl font-bold">{tokenBalance.total_tokens_used}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <div className="flex-1 flex gap-2">
                  <Input
                    type="number"
                    placeholder="Tokens to add"
                    value={tokensToAdd}
                    onChange={(e) => setTokensToAdd(e.target.value)}
                    min="1"
                  />
                  <Button
                    onClick={handleAddTokens}
                    disabled={tokenTopUpMutation.isPending || !tokensToAdd}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tokens
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={handleResetTokens}
                  disabled={tokenResetMutation.isPending}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Tokens
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Unable to load token balance</p>
          )}
        </CardContent>
      </Card>

      {/* User Data Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>User Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              {profile ? (
                <div className="space-y-4">
                  <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                    {JSON.stringify(profile, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground">No profile data</p>
              )}
            </TabsContent>

            <TabsContent value="education" className="mt-4">
              {education && education.length > 0 ? (
                <div className="space-y-4">
                  {education.map((edu: any, idx: number) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <pre className="text-sm">{JSON.stringify(edu, null, 2)}</pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No education data</p>
              )}
            </TabsContent>

            <TabsContent value="experience" className="mt-4">
              {experiences && experiences.length > 0 ? (
                <div className="space-y-4">
                  {experiences.map((exp: any, idx: number) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <pre className="text-sm">{JSON.stringify(exp, null, 2)}</pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No experience data</p>
              )}
            </TabsContent>

            <TabsContent value="skills" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {skills && skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill: any, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {skill.name || JSON.stringify(skill)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {languages && languages.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang: any, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {lang.name || JSON.stringify(lang)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {certifications && certifications.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Certifications</h4>
                    <div className="space-y-2">
                      {certifications.map((cert: any, idx: number) => (
                        <Card key={idx}>
                          <CardContent className="pt-4">
                            <pre className="text-xs">{JSON.stringify(cert, null, 2)}</pre>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="other" className="mt-4">
              <div className="space-y-4">
                {links && links.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Links</h4>
                    <div className="space-y-2">
                      {links.map((link: any, idx: number) => (
                        <Card key={idx}>
                          <CardContent className="pt-4">
                            <pre className="text-xs">{JSON.stringify(link, null, 2)}</pre>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {projects && projects.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Projects</h4>
                    <div className="space-y-2">
                      {projects.map((project: any, idx: number) => (
                        <Card key={idx}>
                          <CardContent className="pt-4">
                            <pre className="text-xs">{JSON.stringify(project, null, 2)}</pre>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {custom_sections && custom_sections.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Custom Sections</h4>
                    <div className="space-y-2">
                      {custom_sections.map((section: any, idx: number) => (
                        <Card key={idx}>
                          <CardContent className="pt-4">
                            <pre className="text-xs">{JSON.stringify(section, null, 2)}</pre>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {(!links || links.length === 0) &&
                  (!projects || projects.length === 0) &&
                  (!custom_sections || custom_sections.length === 0) && (
                    <p className="text-muted-foreground">No additional data</p>
                  )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

