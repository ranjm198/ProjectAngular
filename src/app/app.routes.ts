import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddCoursComponent } from './cours/add-cours/add-cours.component';
import { ListCoursComponent } from './cours/list-cours/list-cours.component';
import { UpdateCoursComponent } from './cours/update-cours/update-cours.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { QuizCreateComponent } from './quiz-create/quiz-create.component';
import { QuizResultsComponent } from './quiz-results/quiz-results.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizAnswerComponent } from './quiz-answer/quiz-answer.component';
import { JoinedCoursesComponent } from './joined-courses/joined-courses.component';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamSubmitComponent } from './exam-submit/exam-submit.component';
import { SubmittedExamsComponent } from './submitted-exams/submitted-exams.component';
import { ExamUploadComponent } from './exam-upload/exam-upload.component';
import { NgModule } from '@angular/core';
import { ChatComponent } from './chat/chat.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'add-cours', component: AddCoursComponent },
  { path: 'list-cours', component: ListCoursComponent },
  { path: 'update-cours', component: UpdateCoursComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'quiz-create', component: QuizCreateComponent },
  { path: 'quiz-list', component: QuizListComponent },
  { path: 'quiz-answer/:quizId', component: QuizAnswerComponent },
  { path: 'quiz-results', component: QuizResultsComponent },
  
    { path: 'cours-join', component: JoinedCoursesComponent },
 // 🔹 Étudiant
  { path: 'exams', component: ExamListComponent },              
  { path: 'submit-exam', component: ExamSubmitComponent },   

  // 🔹 Enseignant
  { path: 'add-exam', component: ExamUploadComponent },            
  { path: 'submissions', component: SubmittedExamsComponent },
    { path: 'chat', component: ChatComponent },
{ path: 'chat-room/:id', component: ChatRoomComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}